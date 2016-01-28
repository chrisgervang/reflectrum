import React from 'react';
import ReactDOM from 'react-dom';

//A module can have many named exports but only one default export.
import Clock from './clock/clock.js';
// import Calendar from './calendar/calendar.js'
import MainMenu from './menu/main_menu.js'

var mainMenuApps = [
    {
      title: "Screensavers",
      icon: "Screensaver.svg"
    },
    {
      title: "Weather",
      icon: "Weather.svg"
    },
    {
      title: "Clock",
      icon: "Clock.svg"
    },
    {
      title: "Calendar",
      icon: "Calendar.svg"
    },
    {
      title: "Quotes",
      icon: "Quotes.svg"
    }
]

class Main extends React.Component {
  render() {
     return (
      <div>
        <MainMenu message="Goodmorning" items={ mainMenuApps }/>

      </div>
    )
  }
}

ReactDOM.render(<Main />, document.body);
