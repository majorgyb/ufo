import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {storeSetup} from './store-setup'
import Config from './config/config-index'
import { ipcRenderer, remote  } from 'electron'
// React
import EventCatcher from './app/components/root-event-catcher'
import AppControls from './app/components/app-controls'
import ToggleBar from './app/components/togglebar'
import Sidebar from './general-components/sidebar'
import Navbar from './navbar/navbar-index'
import ViewPlacer from './view-placer/vp-index'
import FsWrite from './filesystem/write/fs-write-index'
import AddonBar from './addon-bar/components/addon-bar'
import * as Utils from './utils/utils-index'

const windowID = remote.getCurrentWindow().id
const store = storeSetup();

store.dispatch(Config.actions.loadPreviousState(windowID))
window.store = store
window.utils = Utils.storage
ipcRenderer.on('saveState', function(event) {
  Utils.storage.saveStatetoStorage(store.getState(), windowID, function() {
    ipcRenderer.send('closeWindow', windowID)
  })
})

ReactDOM.render(
  <Provider store={ store }>
    <EventCatcher>
      <Sidebar>
        <AppControls />
        <Navbar.components.parent />
        <ToggleBar />
      </Sidebar>
      <ViewPlacer.components.parent />
      <AddonBar/>
    </EventCatcher>
  </Provider>
  ,
  document.getElementById('app')
);