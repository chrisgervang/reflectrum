import React from 'react';
import {pages} from '../helpers/pages.js';
import { connect } from 'react-redux';

let ViewStack = ({activePageName}) => {
  console.log(pages, activePageName)
  return (
    pages[activePageName]
  )
}

const mapStateToProps = (state) => {
  console.log(state)
  console.log("YO")
  return {
    activePageName: state.activePageName
  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

//console.log(ViewStack)
ViewStack = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewStack)
//console.log(ViewStack)

export default ViewStack;
