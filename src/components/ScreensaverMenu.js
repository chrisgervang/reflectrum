import React, { Component } from 'react';
import Menu from './menu/Menu';

var data = {
  message: "Screensavers",
  items: [
      {
        name: "lockscreen",
        color: "#00F5EA"
      },
      {
        name: "tetris",
        color: "#5AC8FA"
      },
      {
        name: "map",
        color: "#FFE620"
      }
  ]
}

class ScreensaverMenu extends Component {
  render() {
    return <Menu {...this.props} {...data}/>
  }
}

export default ScreensaverMenu;
