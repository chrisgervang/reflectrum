import React, { Component } from 'react';
import Menu from './menu/Menu';
import { connect } from 'react-redux';
import { mainMenu } from '../main'
import { Greeting } from './common/Greeting';

const mapDispatchToProps = (dispatch) => {
  return {
    upClick: () => {
      dispatch({
        type: "SCROLL_UP"
      })
    },
    downClick: () => {
      dispatch({
        type: "SCROLL_DOWN",
        MAX: mainMenu.items.length - 1
      })
    },
    primaryClick: (selectedItem) => {
      dispatch({
        type: "OPEN_ITEM",
        page: mainMenu.items[selectedItem].key
      })
    },
    secondaryHold: () => {
      dispatch({
        type: "OPEN_MAIN_MENU"
      })
    },
    secondaryClick: () => {
      dispatch({
        type: "BACK"
      })
    }
  }
}

const mapStateToProps = (state) => {

  var menuMessage = Greeting.getGreeting() + state.username

  return {
    menuMessage: menuMessage,
    items: mainMenu.items,
    selectedItem: state.selectedItem
  }
}

const MainMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)

export default MainMenu;
