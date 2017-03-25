//@flow
import * as t from "./navbar-actiontypes";
import App from "../app/app-index";
import { Map, List } from "immutable";

const INITIAL_STATE = Map({ groupItems: List(), activeItem: "" });

import type { Action } from "../types";

export default function navbarReducer(
  state: any = INITIAL_STATE,
  action: Action = { type: "", payload: {} }
) {
  switch (action.type) {
    case App.actiontypes.APP_CHANGE_PATH:
      return state.set("activeItem", action.payload.pathRoute[0]);

    case t.MOVE_NAVGROUP:
      if (action.payload.hoverIndex < 0) return state;
      let oldgroup = state.get("groupItems").get(action.payload.dragIndex);
      let newgrouplist = state
        .get("groupItems")
        .delete(action.payload.dragIndex)
        .insert(action.payload.hoverIndex, oldgroup);
      return state.set("groupItems", newgrouplist);

    case t.MOVE_GROUPITEM:
      if (action.payload.hoverIndex < 0) return state;
      let olditem = state.getIn([
        "groupItems",
        action.payload.groupIndex,
        "items",
        action.payload.dragIndex
      ]);
      let newitemlist = state
        .getIn(["groupItems", action.payload.groupIndex, "items"])
        .delete(action.payload.dragIndex)
        .insert(action.payload.hoverIndex, olditem);
      return state.setIn(
        ["groupItems", action.payload.groupIndex, "items"],
        newitemlist
      );

    case t.NAVBAR_TOGGLE_GROUP:
      let hidden = state.getIn([
        "groupItems",
        action.payload.groupID,
        "hidden"
      ]);
      return state.setIn(
        ["groupItems", action.payload.groupID, "hidden"],
        !hidden
      );

    case t.ADD_NAVGROUP:
      const pl = action.payload; // pl.items is an array of "path" strings
      if (pl.position != undefined) {
        return state.set(
          "groupItems",
          state.get("groupItems").insert(
            pl.position,
            Map({
              id: pl.id,
              title: pl.title,
              hidden: pl.hidden,
              items: pl.items
            })
          )
        );
      } else {
        return state.set(
          "groupItems",
          state.get("groupItems").push(
            Map({
              id: pl.id,
              title: pl.title,
              hidden: pl.hidden,
              items: pl.items
            })
          )
        );
      }

    case t.ADD_GROUP_ITEM:
      let addIndex = state
        .get("groupItems")
        .findIndex(group => group.get("id") === action.payload.groupID);
      let newItems = state
        .getIn(["groupItems", addIndex, "items"])
        .push(...action.payload.items);
      return state.setIn(["groupItems", addIndex, "items"], newItems);

    case t.NAVBAR_REMOVE_GROUP_ITEM:
      let rmIndex = state
        .get("groupItems")
        .findIndex(group => group.get("id") === action.payload.groupID);
      return state.deleteIn([
        "groupItems",
        rmIndex,
        "items",
        action.payload.itemID
      ]);

    case t.REMOVE_DISKGROUP_ITEM:
      const deviceGroupIndex = state
        .get("groupItems")
        .findIndex(group => group.get("id") === 0);
      const deviceGroupItem = state
        .getIn(["groupItems", deviceGroupIndex, "items"])
        .findIndex(item => item.get("path") === action.payload.fileObj.path);
      return state.deleteIn([
        "groupItems",
        deviceGroupIndex,
        "items",
        deviceGroupItem
      ]);

    case t.NAVBAR_CHANGE_GROUP_TITLE:
      return state.setIn(
        ["groupItems", action.payload.groupID, "title"],
        action.payload.newTitle
      );

    case t.REMOVE_NAVGROUP:
      return state.deleteIn(["groupItems", action.payload.groupIndex]);

    default:
      return state;
  }
}
