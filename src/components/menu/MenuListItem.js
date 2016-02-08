import React from 'react';
import Icon from '../common/Icon';
import './Menu.css!';

class MenuListItem extends React.Component {
  render() {
    return (
      <div className="menu-list-item">
        <div className="menu-list-item-icon">
          <Icon name={this.props.name} color={this.props.color}/>
        </div>
        <div className="menu-list-item-text">{ this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1) }</div>
      </div>
    )
  }
}

export default MenuListItem;
