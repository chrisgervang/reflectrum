import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ViewStack from './components/ViewStack.jsx';
import { mainMenu } from './components/MainMenu.jsx';
import moment from 'moment';
import './base.css';


//A module can have many named exports but only one default export.


//TODO: Settings page (contains locationCache, additional pages, username, calendar logout, idle page)
//TODO: Store additonal pages in localStorage

//VEC: Remote scheduling of "additional page"
//VEC: Additional Pages API

const runtimeConfig = window.REFLECTRUM_CONFIG || {};

if (!localStorage.getItem('username')) {
  localStorage.setItem('username', runtimeConfig.username || 'Mirror');
}

if (!localStorage.getItem('locationCache') && runtimeConfig.location) {
  localStorage.setItem('locationCache', JSON.stringify(runtimeConfig.location));
}

const locationCache = localStorage.getItem('locationCache');

let wakeLock = null;
const requestWakeLock = async () => {
  if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
  } catch (error) {
    console.warn('Unable to acquire a screen wake lock:', error.message);
  }
};

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && (!wakeLock || wakeLock.released)) {
    requestWakeLock();
  }
});
requestWakeLock();

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
  locationCache: locationCache ? JSON.parse(locationCache) : null,
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



createRoot(document.getElementById('target')).render(
  <Provider store={createStore(reflectrumApp)}>
    <ViewStack/>
  </Provider>
);

// ReactDOM.render(
//   <Opening/>,
// document.getElementById("target"));

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
