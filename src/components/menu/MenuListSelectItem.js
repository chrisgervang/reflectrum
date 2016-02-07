import React, { Component } from 'react';
import { NO_EVENT, UP_CLICK, DOWN_CLICK, SECONDARY_HOLD, SECONDARY_CLICK, PRIMARY_HOLD, PRIMARY_CLICK } from '../../helpers/events'

class MenuListSelectItem extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      listLocation: 0
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.event !== this.props.event;
  }

  render() {

    if(this.props.event != NO_EVENT) {
      console.log(this.props.event);
    }

    if(this.props.event === UP_CLICK) {
      if (this.state.listLocation !== 0) {
        this.setState({listLocation: this.state.listLocation - 1});
      }
    }

    if(this.props.event === DOWN_CLICK) {
      if (this.state.listLocation !== this.props.items.length - 1) {
        this.setState({listLocation: this.state.listLocation + 1});
      }
    }

    var styles = {
      selectorLocation: {
        top: (this.state.listLocation * 200) + 280 + 'px'
      }
    }

    return (
      <div style={styles.selectorLocation} className="menu-list-select-item"></div>
    )
  }
}

export default MenuListSelectItem;
