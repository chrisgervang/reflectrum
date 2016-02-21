import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Lockscreen } from './lockscreen/Lockscreen.js';

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

const mapStateToProps = (state) => {
  return {
    locationCache: state.locationCache,
    forecastIOapiKey: state.forecastIOapiKey
  }
}

export const LockscreenScreensaver = connect(
  mapStateToProps,
  mapDispatchToProps
)(Lockscreen)
