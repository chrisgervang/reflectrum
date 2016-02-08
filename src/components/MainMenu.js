import React, { Component } from 'react';
import Menu from './menu/Menu';
import { store } from '../main'
class MainMenu extends Component {
  render() {
    return <Menu {...store.getState().mainMenu}/>
  }
}

export default MainMenu;
