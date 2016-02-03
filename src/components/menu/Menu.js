import React, { Component } from 'react';
import './Menu.css!';
import MenuList from './MenuList'

class Menu extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <div className="clock">7:20 PM</div>
        <div className="greeting">{ this.props.message }</div>
        <MenuList className="menu-group" {...this.props}/>
      </div>
    );
  }
}

export default Menu;
