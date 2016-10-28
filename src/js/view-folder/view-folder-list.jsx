import React from 'react'
import { connect } from 'react-redux'
import * as FsMergedSelector from  '../filesystem/fs-merged-selectors'
import FileItem from '../file-item/components/file-item'
import classnames from 'classnames'
import {Map} from 'immutable'
import {dragndrop} from '../utils/utils-index'
import Button from '../general-components/button'
import fsWrite from '../filesystem/write/fs-write-index'

@connect(() => {
  const getFilesMergedOf = FsMergedSelector.getFilesMergedOf_Factory()
  return (state, props) => {
    return {
      folder: getFilesMergedOf(state, props)
    }
  }
})
export default class DisplayList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: Map({
        dropTarget: false
      })
    }
    this.dragInOutCount = 0
  }

  render() {
    let fileList = ""
    if(this.props.folder) {
      fileList = this.props.folder.valueSeq().map((file, index) => {
        return ( <FileItem
          key={index}
          file={file}
          dispatch={this.props.dispatch}
        /> )
      })
    }

    return(
      <div className={classnames({
        'display-list': true,
        'drag-target': this.state.data.get('dropTarget')
      })}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      >
        {fileList}
        <Button text="new Folder" onClick={() => {
          this.props.dispatch( fsWrite.actions.newFolder(this.props.path) )
        }} />
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.folder !== this.props.folder || nextState.data !== this.state.data;
  }
  
  setImmState(fn) {
    // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
    return this.setState(({data}) => ({
      data: fn(data)
    }));
  }


  onDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = "copy"
    this.setImmState((prevState) => (prevState.set('dropTarget', true)))
  }

  onDragEnter = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.dragInOutCount++
    this.setImmState((prevState) => (prevState.set('dropTarget', true)))
  }

  onDragLeave = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.dragInOutCount--
    if(this.dragInOutCount < 1) {
      this.setImmState((prevState) => (prevState.set('dropTarget', false)))
    }
  }

  onDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.setImmState((prevState) => (prevState.set('dropTarget', false)))
    dragndrop.handleFileDrop(event, this.props.path)
  }
}
