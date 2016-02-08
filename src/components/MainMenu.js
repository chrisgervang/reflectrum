import React, { Component } from 'react';
import Menu from './menu/Menu';
import { store } from '../main'
class MainMenu extends Component {
  render() {
    return <Menu {...store.getState().mainMenu}/>
  }
}

class MainMenuList extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const props = this.props;
    const state = store.getState();

    return
  }
}

export default MainMenu;
