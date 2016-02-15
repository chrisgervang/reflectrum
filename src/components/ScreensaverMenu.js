import React, { Component } from 'react';
import Menu from './menu/Menu';
import { connect } from 'react-redux';

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
        MAX: screensaverMenu.items.length - 1
      })
    },
    primaryClick: (selectedItem) => {
      dispatch({
        type: "OPEN_ITEM",
        page: screensaverMenu.items[selectedItem].key
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
  return {
    menuMessage: state.menuMessage,
    items: screensaverMenu.items,
    selectedItem: state.selectedItem
  }
}

const MainMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)

export default MainMenu;
