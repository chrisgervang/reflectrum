import React, { Component } from 'react';
import './Menu.css!';
import MenuList from './MenuList'
import { MirrorEvents } from '../../helpers/events';
import Clock from '../common/Clock'

class Menu extends Component {
  componentDidMount() {
    this.handlers = []
    this.handlers.push(
      MirrorEvents.addListener('UP_CLICK', () => {
        this.props.upClick()
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('DOWN_CLICK', () => {
        this.props.downClick()
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('PRIMARY_CLICK', () => {
        this.props.primaryClick(this.props.selectedItem)
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_HOLD', () => {
        this.props.secondaryHold()
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_CLICK', () => {
        this.props.secondaryClick()
      })
    );
  }

  componentWillUnmount() {
    this.handlers.map((handler) =>{
      handler.remove();
    })
  }

  render() {
    // console.log(this.props);
    const props = this.props;
    return (
      <div>
        <Clock />
        <div className="greeting">{ props.menuMessage }</div>
        <MenuList items={props.items} selectedItem={props.selectedItem}/>
      </div>
    );
  }
}

export default Menu;
