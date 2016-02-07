import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'


//A module can have many named exports but only one default export.
import Clock from './components/clock/clock.js';
// import Calendar from './calendar/calendar.js'
import MainMenu from './components/MainMenu.js'
import ScreensaverMenu from './components/ScreensaverMenu.js';
import KeyboardEvents from './components/common/KeyboardEvents';


class Main extends React.Component {
  render() {
    // console.log(this);

     return (
      <KeyboardEvents>
        {this.props.children}
      </KeyboardEvents>
    )
  }
}

ReactDOM.render((
    <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={MainMenu} />
      <Route path="menu" component={MainMenu} />
      <Route path="screensavers" component={ScreensaverMenu} />
      <Route path="clock" component={Clock} />
    </Route>
  </Router>
), document.getElementById("target"));
