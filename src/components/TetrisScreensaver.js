import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tetris } from './tetris/Tetris.js';

const mapDispatchToProps = (dispatch) => {
  return {
    secondaryHold: () => {
      dispatch({
        type: "OPEN_MAIN_MENU"
      })
    },
    secondaryClick: () => {
      dispatch({
        type: "BACK"
      })
    }
  }
}

export const TetrisScreensaver = connect(
  (state) => {return {}},
  mapDispatchToProps
)(Tetris)
