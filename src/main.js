import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import Redux, { createStore, combineReducers } from 'redux';

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

var mainMenuData = {
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
        color: "#787AFF",
      }
  ],
  selectedItem: 0
}

const mainMenu = (state = mainMenuData, action) => {
  switch (action.type) {
    case 'SCROLL_DOWN':
      if (store.getState().mainMenu.selectedItem !== store.getState().mainMenu.items.length - 1) {
        return Object.assign({}, state, {
          selectedItem: store.getState().mainMenu.selectedItem + 1
        });
      } else {
        return state;
      }
      break;
    case 'SCROLL_UP':
      if (store.getState().mainMenu.selectedItem !== 0) {
        return Object.assign({}, state, {
          selectedItem: store.getState().mainMenu.selectedItem - 1
        });
      } else {
        return state;
      }
      break;
    case 'OPEN_ITEM':


    default:
      return state;
  }
}

const reflectrumApp = combineReducers({
  mainMenu
})

export const store = createStore(reflectrumApp);

const render = () => {

  const routes =
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={MainMenu} />
      <Route path="menu" component={MainMenu} />
      <Route path="screensavers" component={ScreensaverMenu} />
      <Route path="clock" component={Clock} />
    </Route>
  </Router>

  ReactDOM.render(routes, document.getElementById("target"));

}
// store.subscribe(render);
render();
