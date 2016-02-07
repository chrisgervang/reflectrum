import React, { Component } from 'react';
import Menu from './menu/Menu';

var data = {
  message: "Goodmorning, Michelle",
  items: [
      {
        name: "screensavers",
        color: "#00F5EA"
      },
      {
        name: "weather",
        color: "#F2F4FF"
      },
      {
        name: "clock",
        color: "#FF9500"
      },
      {
        name: "calendar",
        color: "#FF3B30"
      },
      {
        name: "quotes",
        color: "#787AFF"
      }
  ],
  listLocation: 0
}

class MainMenu extends Component {
  render() {
    return <Menu {...this.props} {...data}/>
  }
}

export default MainMenu;
