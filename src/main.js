import React from 'react';
import ReactDOM from 'react-dom';

//A module can have many named exports but only one default export.
import Clock from './components/clock/clock.js';
// import Calendar from './calendar/calendar.js'
import Menu from './components/menu/Menu.js'

import KeyboardEvents from './components/common/KeyboardEvents';


var mainMenu = {
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
  ]
}


class Main extends React.Component {
  render() {
    // console.log(this);

     return (
      <KeyboardEvents>
        <Menu { ...mainMenu }/>
      </KeyboardEvents>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById("target"));
