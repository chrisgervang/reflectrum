import React, {Component} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {pages} from '../helpers/pages.js';
import { MirrorEvents } from '../helpers/events';

class Standby extends Component {
  componentDidMount() {
    this.int = setInterval(() => {
      var time = moment().valueOf();
      let activePageName = this.props.activePageName;

      // 300000ms is 5m
      var delay = 300000
      // var delay = 5000
      
      if (time - this.props.lastActive > delay
          && this.props.standby === false
          && (activePageName === "MAIN_MENU" || activePageName === "SCREENSAVER_MENU" || activePageName === "WEATHER" || activePageName === "CALENDAR")
      ) {
        this.props.standbyAction(true)
      }
    }, 5000);

    //standby handlers
    this.handlers = []
    this.handlers.push(
      MirrorEvents.addListener('UP_CLICK', () => {
        this.props.standbyAction(false)
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('DOWN_CLICK', () => {
        this.props.standbyAction(false)
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('PRIMARY_CLICK', () => {
        this.props.standbyAction(false)
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('PRIMARY_HOLD', () => {
        this.props.standbyAction(false)
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_HOLD', () => {
        this.props.standbyAction(false)
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_CLICK', () => {
        this.props.standbyAction(false)
      })
    );
  }

  componentWillUnmount() {
    clearInterval(this.int)

    this.handlers.map((handler) =>{
      handler.remove();
    })
  }

  render() {
    const standbyFlag = this.props.standby

    var styles = {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      backgroundColor: "black"
    }

    var screensaver = null
    if(standbyFlag) {
      screensaver = <div className="animated fadeIn" style={styles}>
                      {pages["LOCKSCREEN"]}
                    </div>
    }

    return screensaver;
  }
}

const mapStateToProps = (state) => {
  return {
    standby: state.standby,
    activePageName: state.activePageName,
    lastActive: state.lastActive
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    standbyAction: (flag) => {
      dispatch({
        type: "STANDBY",
        standby: flag
      })
    }
  }
}

export const StandbyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Standby)
