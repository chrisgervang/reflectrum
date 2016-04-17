import React from 'react';
import './clock.css!'

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: 0,
      minute: 0,
      second: 0,
    };
    this. updateHands = this. updateHands.bind(this);
  }

  componentDidMount() {
    var int = setInterval(this.updateHands, 1000);
  }

  updateHands() {
    var d = new Date();
    var h = d.getHours();

    var hour = ((h > 12 ? h - 12 : h)*30)-90;
    var minute = (d.getMinutes()/*0-59*/*6)-90;
    var second = (d.getSeconds()/*0-59*/*6)-90;

    // if(deg == -90) {
    //   $object.data('plus-deg', $object.data('plus-deg')+360);
    // }
    // deg += $object.data('plus-deg');

    if (this.state.hour != hour) {
      this.setState({hour: hour});
      console.log(hour);
    }

    if (this.state.minute != minute) {
      this.setState({minute: minute});
    }

    if (this.state.second != second) {
      this.setState({second: second});
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
