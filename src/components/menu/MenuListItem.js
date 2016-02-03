import React from 'react';
import Icon from '../common/Icon';
import './Menu.css!';

class MenuListItem extends React.Component {
  render() {
    return (
      <div className="menu-list-item">
        <Icon className="icon" { ...this.props }/>
        <div className="menu-list-item-text">{ this.props.name.toUpperCase() }</div>
      </div>
    )
  }
}

export default MenuListItem;
