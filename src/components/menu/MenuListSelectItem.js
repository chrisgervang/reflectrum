import React, { Component } from 'react';
import { MirrorEvents } from '../../helpers/events';
import { store } from '../../main';

class MenuListSelectItem extends Component {
  constructor(props) {
    super(props);

    MirrorEvents.addListener('UP_CLICK', () => {
      store.dispatch({
        type: "SCROLL_UP"
      });
    });
    MirrorEvents.addListener('DOWN_CLICK', () => {
      store.dispatch({
        type: "SCROLL_DOWN"
      });
    });
  }

  render() {
    var styles = {
      selectorLocation: {
        top: (this.props.listLocation * 200) + 280 + 'px'
      }
    }

    return (
      <div style={styles.selectorLocation} className="menu-list-select-item"></div>
    )
  }
}

export default MenuListSelectItem;
