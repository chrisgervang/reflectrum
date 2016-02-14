import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MirrorEvents } from '../../helpers/events';


export class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.mapSrc("San Mateo,CA", 13)
    }
    this.mapSrc = this.mapSrc.bind(this);
  }

  componentDidMount() {
    const props = this.props;
    this.handlers = []
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_HOLD', () => {
        props.secondaryHold()
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_CLICK', () => {
        props.secondaryClick()
      })
    );
  }

  componentWillUnmount() {
    this.handlers.map((handler) =>{
      handler.remove();
    })
  }

  mapSrc(location, zoom) {
    return "\'https://maps.googleapis.com/maps/api/staticmap?center="+location+
      "&zoom="+zoom+"&format=png&sensor=false&scale=2&size="+window.innerWidth+
      "x"+window.innerHeight+"&maptype=roadmap&style=visibility:on|weight:1|invert_lightness:true|saturation:-100|lightness:1\'"
    //$(".map").css("background-image","url("+link+")");
  }

  render() {
    var styles = {
      map: {
        height: "1366px",
        width: "768px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: "url("+this.state.link+")"
      }
    }
    return (
      <div style={styles.map}></div>
    );
  }

}


const mapDispatchToProps = (dispatch) => {
  return {
    secondaryHold: () => {
      dispatch({
        type: "OPEN_MAIN_MENU"
      })
    },
    secondaryClick: () => {
      dispatch({
        type: "BACK"
      })
    }
  }
}

export const MapScreensaver = connect(
  (state) => {return {}},
  mapDispatchToProps
)(Map)
