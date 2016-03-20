import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import Redux, { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ViewStack from './components/ViewStack.js';
import { mainMenu } from './components/MainMenu.js';
import {pages} from './helpers/pages.js';
import moment from 'moment';


//A module can have many named exports but only one default export.


//TODO: Settings page (conatins locationCache, add additional pages, username, calendar logout, forecastIOapiKey, idle page)
//TODO: Store additonal pages in localStorage

//VEC: Remote scheduling of "additional page"
//VEC: Additional Pages API

if(!localStorage.getItem('username')) {
  console.log("TEST STORAGE")
  localStorage.setItem('username', "Michelle")
}

if(!localStorage.getItem('forecastIOapiKey')) {
  localStorage.setItem('forecastIOapiKey', "5485362f69ad87b5aaa04281f19ce344")
}

if(!localStorage.getItem('locationCache')) {
  localStorage.setItem('locationCache', JSON.stringify({lat: 37.76305200000001, long: -122.4163935}))
}

// Bakersfield, CA
// {
//   lat: 39,
//   long: -119
// },

var data = {
  activePageName: "MAIN_MENU",
  selectedItem: mainMenu.selectedItem,
  history: ["MAIN_MENU"],
  username: localStorage.getItem('username'),
  locationCache: JSON.parse(localStorage.getItem('locationCache')),
  forecastIOapiKey: localStorage.getItem('forecastIOapiKey'),
  standby: false,
  lastActive: moment().valueOf()
}

const reflectrumApp = (state = data, action) => {
  switch(action.type) {
    case 'OPEN_ITEM':
      if (!!action.page && state.standby === false) {
        var newHistory = [...state.history, action.page]
        console.log("OPEN_ITEM: ", newHistory, action.page)

        return Object.assign({}, state, {
          activePageName: action.page,
          history: newHistory,
          lastActive: moment().valueOf()
        });
      } else {
        return state;
      }
      break;

    case 'OPEN_MAIN_MENU':
      if (state.standby === false) {
        var newHistory = [...state.history, "MAIN_MENU"];

        return Object.assign({}, state, {
          activePageName: "MAIN_MENU",
          history: newHistory,
          lastActive: moment().valueOf()
        });
      } else {
        return state;
      }
      break;
    case 'BACK':
      if(state.history.length !== 1 && state.standby === false) {
        var newHistory = [...state.history];
        newHistory.pop();

        console.log("BACK: ", newHistory);
        return Object.assign({}, state, {
          activePageName: newHistory[newHistory.length - 1],
          history: newHistory,
          lastActive: moment().valueOf()
        });
      } else {
        return state;
      }

      break;
    case 'SCROLL_DOWN':
      console.log("SCROLL_DOWN", state, action);
      if (state.selectedItem !== action.MAX && state.standby === false) {
        return Object.assign({}, state, {
          selectedItem: state.selectedItem + 1,
          lastActive: moment().valueOf()
        });
      } else {
        return state;
      }
      break;

    case 'SCROLL_UP':
      if (state.selectedItem !== 0 && state.standby === false) {
        return Object.assign({}, state, {
          selectedItem: state.selectedItem - 1,
          lastActive: moment().valueOf()
        });
      } else {
        return state;
      }
      break;
    case 'SET_LOCATION_CACHE':
      localStorage.setItem('locationCache', JSON.stringify(action.locationCache));
      return Object.assign({}, state, {
        locationCache: action.locationCache
      });
      break;
    case 'SET_USERNAME':
      localStorage.setItem('username', action.username);
      return Object.assign({}, state, {
        username: action.username
      });
      break;
    case 'SET_FORECAST_IO_API_KEY':
      localStorage.setItem('forecastIOapiKey', action.forecastIOapiKey);
      return Object.assign({}, state, {
        forecastIOapiKey: action.forecastIOapiKey
      });
      break;
    case 'STANDBY':
      console.log("STATE", state, action);
      if (action.standby === false) {
        return Object.assign({}, state, {
          standby: action.standby,
          lastActive: moment().valueOf()
        });
      } else {
        return Object.assign({}, state, {
          standby: action.standby
        });
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
