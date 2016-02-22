import React, {Component} from 'react';
import {pages} from '../helpers/pages.js';
import { MirrorEvents } from '../helpers/events';

import { connect } from 'react-redux';
import moment from 'moment';
class ViewStack extends Component {

  componentDidMount() {
    this.int = setInterval(() => {
      var time = moment().valueOf();
      // 300000ms is 5m
      if (time - this.props.lastActive > 300000 && this.props.standby === false) {
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
    const activePageName = this.props.activePageName
    const standbyFlag = this.props.standby

    console.log("ViewStack", pages, activePageName, standby)

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
    return (
      <div>
        {pages[activePageName]}
        {screensaver}

      </div>
    )
  }

}

const mapStateToProps = (state) => {
  //console.log(state)
  //console.log("YO")
  return {
    activePageName: state.activePageName,
    standby: state.standby,
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

ViewStack = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewStack)

export default ViewStack;
