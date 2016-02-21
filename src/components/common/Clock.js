import React, { Component } from 'react';

export default class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: Clock.getTime()
    }

    // this.getTime = this.getTime.bind(this);
  }

  componentDidMount() {
    this.int = setInterval(() => {
      var time = Clock.getTime();
      if (time != this.state.time) {
        this.setState({time: time});
      }
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.int)
  }

  static getTime(options = {"ampm": true}) {
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes;
    if (options.ampm) {
      strTime += ' ' + ampm;
    }

    return strTime;
  }


  render() {
    return (
      <div className="clock">{this.state.time}</div>
    );
  }
}
