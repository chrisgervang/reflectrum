import React, { Component } from 'react';
import './Menu.css!';
import MenuList from './MenuList'
import Clock from '../common/Clock'
class Menu extends Component {
  componentDidMount() {
  }

  render() {
    // console.log(this.props);
    return (
      <div>
        <Clock />
        <div className="greeting">{ this.props.message }</div>
        <MenuList {...this.props}/>
      </div>
    );
  }
}

export default Menu;
