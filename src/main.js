import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import Redux, { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ViewStack from './components/ViewStack.js'

//A module can have many named exports but only one default export.

export const mainMenu = {
  message: "Goodmorning, Michelle",
  selectedItem: 0,
  items: [
    {
      name: "screensavers",
      color: "#00F5EA",
      key: "SCREENSAVER_MENU"
    },
    {
      name: "weather",
      color: "#F2F4FF",
      key: "WEATHER"
    },
    {
      name: "clock",
      color: "#FF9500",
      key: "CLOCK"
    },
    {
      name: "calendar",
      color: "#FF3B30",
      key: "CALENDAR"
    },
    {
      name: "quotes",
      color: "#787AFF",
      key: "QUOTES"
    }
  ]
}

export const screensaverMenu = {
  message: "Screensavers",
  selectedItem: 0,
  items: [
    {
      name: "lockscreen",
      color: "#00F5EA",
      key: "LOCKSCREEN"
    },
    {
      name: "tetris",
      color: "#5AC8FA",
      key: "TETRIS"
    },
    {
      name: "map",
      color: "#FFE620",
      key: "MAP"
    }
  ]
}

var data = {
  activePageName: "MAIN_MENU",
  menuMessage: mainMenu.message,
  selectedItem: mainMenu.selectedItem,
}

const reflectrumApp = (state = data, action) => {
  //console.log("NAV", state)
  switch(action.type) {
    case 'OPEN_ITEM':
      if (action.menu === "MAIN") {
        //console.log(mainMenu.items[state.selectedItem].key)
        return Object.assign({}, state, {
          activePageName: mainMenu.items[state.selectedItem].key
        });
      } else if (action.menu === "SCREENSAVER") {
        return Object.assign({}, state, {
          activePageName: screensaverMenu.items[state.selectedItem].key
        });
      } else {
        return state;
      }
      break;

    case 'OPEN_MAIN_MENU':
      return Object.assign({}, state, {
        activePageName: "MAIN_MENU"
      });
      break;

    case 'SCROLL_DOWN':
      if (state.selectedItem !== action.MAX) {
        return Object.assign({}, state, {
          selectedItem: state.selectedItem + 1
        });
      } else {
        return state;
      }
      break;

    case 'SCROLL_UP':
      if (state.selectedItem !== 0) {
        return Object.assign({}, state, {
          selectedItem: state.selectedItem - 1
        });
      } else {
        return state;
      }
      break;

    default:
      return state;
  }

}

ReactDOM.render(
  <Provider store={createStore(reflectrumApp)}>
    <ViewStack/>
  </Provider>,
document.getElementById("target"));

// const render = () => {
//
//   const routes =
//   <Router history={hashHistory}>
//     <Route path="/" component={Main}>
//       <IndexRoute component={MainMenu} />
//       <Route path="menu" component={MainMenu} />
//       <Route path="clock" component={Clock} />
//     </Route>
//   </Router>
// }
