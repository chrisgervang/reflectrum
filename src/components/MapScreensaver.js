import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map } from './map/Map';


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

export const MapScreensaver = connect(
  (state) => {return {}},
  mapDispatchToProps
)(Map)
