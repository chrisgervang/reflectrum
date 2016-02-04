import React, { Component } from 'react';
import { NO_EVENT, UP_CLICK, DOWN_CLICK, SECONDARY_HOLD, SECONDARY_CLICK, PRIMARY_HOLD, PRIMARY_CLICK } from '../../helpers/events'

class KeyboardEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      up:        false, //click, false
      down:      false, //click, false
      primary:   false, //click, hold, false
      secondary: false, //click, hold, false
      eventEmitter: NO_EVENT
    }
    // console.log(this);
    this._handleKeyUp   = this._handleKeyUp.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    // this.content = this.content.bind(this);
    document.addEventListener( 'keydown', this._handleKeyDown );
    document.addEventListener( 'keyup', this._handleKeyUp );
  }

  content() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        event: this.state.eventEmitter
      })
    );
  }

  // ee: new EventEmitter();

  _handleKeyUp(event) {
    if(event.keyCode == 38) {
      //single press (on key down): scroll up one item

      switch(this.state.up) {
        case "click":
          this.setState({up: false, eventEmitter: NO_EVENT});
          break;
      }

    } else if(event.keyCode == 40) {
      //single press (on key down): scroll down one item

      switch(this.state.down) {
        case "click":
          this.setState({down: false, eventEmitter: NO_EVENT});
          break;
      }

    } else if(event.keyCode == 39) {
      //single press (wait for keyup): select (move forward)
      //press hold: voice control or command center

      switch(this.state.primary) {
        case "click":
          // this.ee.emitEvent('primaryClick');             /////////  primaryClick
          // console.log('primaryClick');
          this.setState({primary: false, eventEmitter: PRIMARY_CLICK});
          break;
        case "hold":
          this.setState({primary: false, eventEmitter: NO_EVENT});
          break;
      }

    } else if(event.keyCode == 37) {
      //single press (wait for keyup): go back
      //press hold: go to menu

      switch(this.state.secondary) {
        case "click":
          // this.ee.emitEvent('secondaryClick');         /////////  secondaryClick
          // console.log('secondaryClick');
          this.setState({secondary: false, eventEmitter: SECONDARY_CLICK});
          break;
        case "hold":
          this.setState({secondary: false, eventEmitter: NO_EVENT});
          break;
      }

    }
  }

  _handleKeyDown(event) {
    //seperate switch for turning the display on and off,
    //which I'd like to be a capacitive touch button on the top right of the mirror.

    //The scroll wheel: triggers a keypress every half a turn (or something).
    if(event.keyCode == 39) {
      //single press (wait for keyup): select (move forward)
      //press hold: voice control or command center

      if(this.state.primary === false) {
        this.setState({primary: "click", eventEmitter: NO_EVENT});
      } else if(this.state.primary === "click") {
        this.setState({primary: "hold", eventEmitter: PRIMARY_HOLD});
        // ee.emitEvent('primaryHold');                      /////////  primaryHold
        // console.log('primaryHold');
      }

    } else if(event.keyCode == 37) {
      //single press (wait for keyup): go back
      //press hold: go to menu
      if(this.state.secondary === false)
        this.setState({secondary: "click", eventEmitter: NO_EVENT});
      else if(this.state.secondary === "click") {
        this.setState({secondary: "hold", eventEmitter: SECONDARY_HOLD});
        // ee.emitEvent('secondaryHold');                  /////////  secondaryHold
        // console.log('secondaryHold');

      }

    } else if(event.keyCode == 38) {
      //single press (on key down): scroll up one item
      if(this.state.up === false) {
        // ee.emitEvent('upClick');                       /////////  upClick
        // console.log("upClick");
        this.setState({up: "click", eventEmitter: UP_CLICK});
      }


    } else if(event.keyCode == 40) {
      //single press (on key down): scroll down one item
      if(this.state.down === false) {
        // ee.emitEvent('downClick');                    /////////  downClick
        // console.log("downClick");
        this.setState({down: "click", eventEmitter: DOWN_CLICK});
      }

    }
  }

  render() {
    return <div>{ this.content() }</div>
  }

}

export default KeyboardEvents;
