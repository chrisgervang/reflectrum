import React, { Component } from 'react';
import { NO_EVENT, UP_CLICK, DOWN_CLICK, SECONDARY_HOLD, SECONDARY_CLICK, PRIMARY_HOLD, PRIMARY_CLICK } from '../../helpers/events'

class MenuListSelectItem extends Component {
  render() {
    if(this.props.event != NO_EVENT) {
      console.log(this.props.event);
    }

    return (
      <div className="menu-list-select-item"></div>
    )
  }
}

export default MenuListSelectItem;
