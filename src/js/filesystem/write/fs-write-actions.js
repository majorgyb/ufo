import {ipcRenderer} from 'electron'
import nodePath from 'path'
import trash from 'trash'
import {fork} from 'child_process'
import * as c from './fs-write-constants'
import * as t from './fs-write-actiontypes'

export function moveToTrash(sources) {
  trash(sources)
}

export function move(sources, targetFolder, options) {
  sources.forEach((src) => {
    startFsWorker(
      src,
      nodePath.join(targetFolder, nodePath.basename(src)), 
      {clobber: false, ...options, move: true}
    )
  })
}

export function copy(sources, targetFolder, options) {
  sources.forEach((src) => {
    startFsWorker(
      src, 
      nodePath.join(targetFolder, nodePath.basename(src)), 
      {clobber: false, ...options, move: false}
    )
  })
}

export function removeAction(id) {
  return {
    type: t.FS_WRITE_REMOVE_ACTION,
    payload: {
      id: id
    }
  }
}

export function startFsWorker(source, destination, options, setId) {
  
  let id = (setId != undefined) ? setId : window.store.getState()[c.NAME].size
  var fsWriteWorker = fork(__dirname + '/child-worker/fs-write-worker.js');

  fsWriteWorker.send({
    id: id,
    source: source,
    dest: destination,
    options
  })

  fsWriteWorker.on('message', function(response) {
    window.store.dispatch(response)
  })

  // fsWriteWorker.on('close', (code) => {
  //   console.log(`fs write worker exit: ${code}`);
  // });
}