import React, {Component} from 'react';
import './WeatherStamp.css!'
import Skycons from 'maxdow/skycons';


export class WeatherStamp extends Component {
  constructor() {
    super()
    this.skycons = new Skycons({
      "monochrome": false,
      // "color": "#ecf0f1",
      "colors" : {
        "cloud" : "#bdc3c7",
        "sun" : "#FFDC00",
        "leaf" : "#2ecc71"
      }
    });
  }

  componentDidMount() {
    this.skycons.set(this.props.time, this.props.icon);
    this.skycons.play();
  }

  componentWillUnmount() {
    this.skycons.remove(this.props.time)
  }

  render() {

    return (
      <div className="animated flipInY weather-stamp">
        <p className="time">{this.props.time}</p>
        <div className="icon">
          <div className="canvas-sizer">
            <canvas id={this.props.time} width="154" height="154"></canvas>
          </div>
        </div>
        <p className="temp">{this.props.temperature}</p>
      </div>
    )
  }
}
