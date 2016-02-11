import React, { Component } from 'react';
import './Menu.css!';
import MenuList from './MenuList'
import { MirrorEvents } from '../../helpers/events';
import Clock from '../common/Clock'

class Menu extends Component {
  componentDidMount() {
    const props = this.props;
    this.handlers = []
    this.handlers.push(
      MirrorEvents.addListener('UP_CLICK', () => {
        props.upClick()
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('DOWN_CLICK', () => {
        props.downClick()
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('PRIMARY_CLICK', () => {
        props.primaryClick()
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_HOLD', () => {
        props.secondaryHold()
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
        <Clock/>
        <div className="greeting">{ props.menuMessage }</div>
        <MenuList items={props.items} selectedItem={props.selectedItem}/>
      </div>
    );
  }
}

export default Menu;
