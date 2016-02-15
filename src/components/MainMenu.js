import React, { Component } from 'react';
import Menu from './menu/Menu';
import { connect } from 'react-redux';
import { Greeting } from './common/Greeting';

export const mainMenu = {
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
