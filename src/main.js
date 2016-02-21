import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import Redux, { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ViewStack from './components/ViewStack.js';
import { mainMenu } from './components/MainMenu.js';

//A module can have many named exports but only one default export.

var data = {
  activePageName: "MAIN_MENU",
  selectedItem: mainMenu.selectedItem,
  history: ["MAIN_MENU"],
  username: "Michelle",
  locationCache: null,
  forecastIOapiKey: '5485362f69ad87b5aaa04281f19ce344'
}
// {
//   lat: 39,
//   long: -119
// },
const reflectrumApp = (state = data, action) => {
  //console.log("NAV", state)
  switch(action.type) {
    case 'OPEN_ITEM':
      if (!!action.page) {
        var newHistory = [...state.history, action.page]
        console.log("OPEN_ITEM: ", newHistory, action.page)

        return Object.assign({}, state, {
          activePageName: action.page,
          history: newHistory
        });
      } else {
        return state;
      }
      break;

    case 'OPEN_MAIN_MENU':
      var newHistory = [...state.history, "MAIN_MENU"]

      return Object.assign({}, state, {
        activePageName: "MAIN_MENU",
        history: newHistory
      });
      break;
    case 'BACK':
      if(state.history.length !== 1) {
        var newHistory = [...state.history]
        newHistory.pop()
        console.log("BACK: ", newHistory)
        return Object.assign({}, state, {
          activePageName: newHistory[newHistory.length - 1],
          history: newHistory
        });
      } else {
        return state
      }

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
