import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
// import Redux, { createStore, combineReducers } from 'redux';

//A module can have many named exports but only one default export.
import Clock from './components/clock/clock.js';
// import Calendar from './calendar/calendar.js'
import MainMenu from './components/MainMenu.js'
import ScreensaverMenu from './components/ScreensaverMenu.js';


class Main extends React.Component {
  render() {
     return (
       <div>{this.props.children}</div>
    )
  }
}

// const mainMenu = (state, action) => {
//   switch (action.type) {
//     case 'CHANGE_LIST_POSITION':
//       //
//       break;
//     default:
//       return state;
//   }
// }
//
// const reflectrumApp = combineReducers({
//   mainMenu
// })
//
// const store = createStore(reflectrumApp);

const render = () => {
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

}
// store.subscribe(reflectrumApp);
render();
