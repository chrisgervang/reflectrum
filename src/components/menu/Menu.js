import React, { Component } from 'react';
import './Menu.css!';
import Clock from '../common/Clock'
class Menu extends Component {
  render() {
    // console.log(this.props);
    return (
      <div>
        <Clock />
        <div className="greeting">{ this.props.message }</div>
        {this.props.children}
      </div>
    );
  }
}

export default Menu;
