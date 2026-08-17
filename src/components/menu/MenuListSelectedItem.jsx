import React, { Component } from 'react';

class MenuListSelectedItem extends Component {
  render() {
    const props = this.props;
    return (
      <div style={{ '--selected-item': props.selectedItem }} className="menu-list-select-item"></div>
    )
  }
}

export default MenuListSelectedItem;
