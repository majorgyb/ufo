"use strict"
import React from 'react'
import { connect } from 'react-redux'
import * as Actions from '../navbar-actions'
import App from '../../app/app-index'
import * as constants from '../navbar-constants'
import { List, Map } from 'immutable'
import NavGroup from './navgroup'
import Selection from '../../selection/sel-index'
import nodePath from 'path'
import _ from 'lodash'
import {remote} from 'electron'


@connect((state) => {
  return {navbar: state[constants.NAME].present,
    state: state
  }
})
export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }

  handleSelectionChanged = (path, groupID, itemID) => {
    this.props.dispatch(App.actions.changeAppPath(path))
  }

  handleOnToggleGroup = (groupID) => {
    this.props.dispatch(Actions.toggleGroup(groupID))
  }

  handleOnItemRemove = (groupIndex, itemID) => {
    // const groupIndex = this.props.navbar.get('groupItems').findIndex(group => group.get('title') === groupTitle)
    this.props.dispatch(Actions.removeGroupItem(groupIndex, itemID))
  }

  handleOnRemoveGroup(groupIndex) {
    this.props.dispatch(Actions.removeNavGroup(groupIndex))
  }

  handleOnGroupTitleChange = (groupID, newTitle) => {
    this.props.dispatch(Actions.changeGroupTitle(groupID, newTitle))
  }

  handledragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "copy"
  }

  handleDrop = (e) => {
    console.log("nav-drop")
    e.preventDefault()
    e.stopPropagation()
    
    let title = _.last(_.split(nodePath.dirname(e.dataTransfer.files[0].path), nodePath.sep))
    
    let files = []
    _.forIn(e.dataTransfer.files, function(value, key) {
      if(_.hasIn(value, 'path'))
      files.push(value.path)
    })
    this.props.dispatch(Actions.addNavGroup(title, files))
  } 

  handleNavGroupDrop(groupID, e) {
    console.log(e, groupID)
    e.preventDefault()
    e.stopPropagation()

    let files = []
    console.log(_)
    _.forIn(e.dataTransfer.files, function(value, key) {

      console.log(_)
      debugger
      if(_.hasIn(value, 'path'))
      files.push(value.path)
    })

    this.props.dispatch(Actions.addGroupItems(groupID, files))
  }

 

  createNavGroup = (item, index) => {
   
    return (<NavGroup
        key={index}
        groupID={index}
        activeItem={this.props.navbar.get("activeItem")}
        title={item.title}
        items={item.items}
        hidden={item.hidden}
        isDiskGroup={item.title === constants.DISKS_GROUP_NAME ? true : false}
        onSelectionChanged={this.handleSelectionChanged}
        onItemRemove={this.handleOnItemRemove}
        onRemoveGroup={this.handleOnRemoveGroup.bind(this, index)}
        onGroupTitleChange={this.handleOnGroupTitleChange}
        onToggleGroup={this.handleOnToggleGroup}
        onDrop={this.handleNavGroupDrop.bind(this, index)}
        />)
  }

  render() {
    let navgroups = null
    if(this.props.navbar.has('groupItems')) 
    navgroups = this.props.navbar.get('groupItems').toJS().map(this.createNavGroup)
    return(
      <div className="nav-bar" onDrop={this.handleDrop} onDragOver={this.handledragOver}>
        {navgroups}
      </div>
    )
  }



}
