import React, { Component } from 'react';
import { MirrorEvents } from '../../helpers/events';
import { store } from '../../main';
import { SlidingHighlight } from './SlidingHighlight';

class MenuListSelectItem extends Component {
  constructor(props) {
    super(props);

    MirrorEvents.addListener('UP_CLICK', () => {
      store.dispatch({
        type: "SCROLL_UP"
      });
    });


    MirrorEvents.addListener('DOWN_CLICK', () => {
      store.dispatch({
        type: "SCROLL_DOWN"
      });
    });
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();
    const top = (state.mainMenu.listLocation * 200) + 280 + 'px'

    return (
      <SlidingHighlight top={top} />
    )
  }
}

export default MenuListSelectItem;
