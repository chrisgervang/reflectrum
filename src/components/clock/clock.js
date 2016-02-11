import React from 'react';
import './clock.css!'
import { MirrorEvents } from '../../helpers/events';
import { connect } from 'react-redux';

const timeToDeg = (date) => {
  // time
  var hr = date.getHours();

  // time in degrees (-90 to 270)
  return {
    hour: ((hr > 12 ? hr - 12 : hr)*30)-90,
    minute: (date.getMinutes()/*0-59*/*6)-90,
    second: (date.getSeconds()/*0-59*/*6)-90
  }
}

export default class Clock extends React.Component {

  static propTypes: {
    hour: React.PropTypes.number,
    minute: React.PropTypes.number,
    second: React.PropTypes.number,
  }

  static defaultProps: {
    hour: 0,
    minute: 0,
    second: 0
  }

  constructor(props) {
    super(props);
    this.state = {
      hour: parseInt(this.props.hour),
      minute: parseInt(this.props.minute),
      second: parseInt(this.props.second),
      h: 0,
      m: 0,
      s: 0
    };
    this._updateHands = this._updateHands.bind(this);
  }

  componentDidMount() {
    const props = this.props;
    this.int = setInterval(this._updateHands, 1000);
    this.handlers = []
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_HOLD', () => {
        props.secondaryHold()
      })
    );
  }

  componentWillUnmount() {
    clearInterval(this.int);
    this.handlers.map((handler) =>{
      handler.remove();
    })
  }

  _updateHands() {
    var d = new Date();
    var degTime = timeToDeg(d)
    var hour = degTime.hour;
    var minute = degTime.minute;
    var second = degTime.second;
    // The hour has changed when the 'hour' plus it's offset 'h' is different than 'this.state.hour'
    if (this.state.hour != hour + this.state.h) {
      if (hour == -90) {
        this.setState({h: this.state.h + 360})
      }
      this.setState({hour: hour + this.state.h});
    }

    if (this.state.minute != minute + this.state.m) {
      if (minute == -90) {
        this.setState({m: this.state.m + 360})
      }
      this.setState({minute: minute + this.state.m});
      console.log(this.state);
    }

    if (this.state.second != second + this.state.s) {
      if (second == -90) {
        this.setState({s: this.state.s + 360})
      }
      this.setState({second: second + this.state.s});
    }

  }

  render () {
    var styles = {
      hour: {
        WebkitTransform: "rotate(" + this.state.hour + "deg)",
        transform: "rotate(" + this.state.hour + "deg)",
        zoom: 1
      },
      minute: {
        WebkitTransform: "rotate("+this.state.minute+"deg)",
        transform: "rotate(" + this.state.minute +"deg)",
        zoom: 1
      },
      second: {
        WebkitTransform: "rotate("+this.state.second+"deg)",
        transform: "rotate("+this.state.second+"deg)",
        zoom: 1
      }
    }
    return (
      <div id="clock" className="animated fadeInUp animate">
        <div className="pointers">
          <span className="hour" style={ styles.hour }></span>
          <span className="minute" style={ styles.minute }></span>
          <span className="second" style={ styles.second }></span>
        </div>
        <div className="pointers shadow">
          <span className="hour" style={ styles.hour }></span>
          <span className="minute" style={ styles.minute }></span>
          <span className="second" style={ styles.second }></span>
        </div>
        <div className="decoration">
          <span className="top"></span>
          <span className="bottom"></span>
          <span className="right"></span>
          <span className="left"></span>
        </div>
      </div>
    )
  }
}

//Container Component
const mapDispatchToProps = (dispatch) => {
  return {
    secondaryHold: () => {
      dispatch({
        type: "OPEN_MAIN_MENU"
      })
    }
  }
}

const mapStateToProps = (state) => {
  return {
    hour: timeToDeg(new Date()).hour,
    minute: timeToDeg(new Date()).minute,
    second: timeToDeg(new Date()).second
  }
}

export const ClockItem = connect(
  mapStateToProps,mapDispatchToProps
)(Clock)
