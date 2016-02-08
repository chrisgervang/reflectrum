import React, { Component } from 'react';
import { MirrorEvents } from '../../helpers/events';

class MenuListSelectItem extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      listLocation: 0
    }

    console.log(MirrorEvents);

    MirrorEvents.addListener('UP_CLICK', () => {
      if (this.state.listLocation !== 0) {
        this.setState({listLocation: this.state.listLocation - 1});
      }
    });
    MirrorEvents.addListener('DOWN_CLICK', () => {
      if (this.state.listLocation !== this.props.items.length - 1) {
        this.setState({listLocation: this.state.listLocation + 1});
      }
    });
  }

  componentDidMount() {


  }


  render() {
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
