import {EventEmitter} from 'fbemitter';

export const MirrorEvents = new EventEmitter();

var state = {
  up:        false, //click, false
  down:      false, //click, false
  primary:   false, //click, hold, false
  secondary: false, //click, hold, false
}

document.addEventListener( 'keyup', function(event) {
  if(event.keyCode == 38) {
    //single press (on key down): scroll up one item

    switch(state.up) {
      case "click":
        state.up = false;
        break;
    }

  } else if(event.keyCode == 40) {
    //single press (on key down): scroll down one item

    switch(state.down) {
      case "click":
        state.down = false;
        break;
    }

  } else if(event.keyCode == 39) {
    //single press (wait for keyup): select (move forward)
    //press hold: voice control or command center

    switch(state.primary) {
      case "click":
        MirrorEvents.emit('PRIMARY_CLICK');
        state.primary = false;
        break;
      case "hold":
        state.primary = false;
        break;
    }

  } else if(event.keyCode == 37) {
    //single press (wait for keyup): go back
    //press hold: go to menu

    switch(state.secondary) {
      case "click":
        MirrorEvents.emit('SECONDARY_CLICK');
        state.secondary = false;
        break;
      case "hold":
        state.secondary = false;
        break;
    }

  }
});

document.addEventListener( 'keydown', function(event){
  //seperate switch for turning the display on and off,
  //which I'd like to be a capacitive touch button on the top right of the mirror.

  //The scroll wheel: triggers a keypress every half a turn (or something).

  if(event.keyCode == 39) {
    //single press (wait for keyup): select (move forward)
    //press hold: voice control or command center

    if(state.primary === false)
      state.primary = "click"
    else if(state.primary === "click") {
      state.primary = "hold"
      MirrorEvents.emit('PRIMARY_HOLD');
    }

  } else if(event.keyCode == 37) {
    //single press (wait for keyup): go back
    //press hold: go to menu
    if(state.secondary === false)
      state.secondary = "click"
    else if(state.secondary === "click") {
      state.secondary = "hold"
      MirrorEvents.emit('SECONDARY_HOLD');
    }

  } else if(event.keyCode == 38) {
    //single press (on key down): scroll up one item
    if(state.up === false) {
      state.up = "click";
      MirrorEvents.emit('UP_CLICK');
    }


  } else if(event.keyCode == 40) {
    //single press (on key down): scroll down one item
    if(state.down === false) {
      state.down = "click";
      MirrorEvents.emit('DOWN_CLICK');
    }

  }
});
