import React, {Component} from 'react';
import './WeatherStamp.css';
import { WeatherIcon } from '../weather/WeatherIcon';


export class WeatherStamp extends Component {
  render() {

    return (
      <div className="animated flipInY weather-stamp">
        <p className="time">{this.props.time}</p>
        <div className="icon">
          <WeatherIcon className="canvas-sizer" icon={this.props.icon} label={this.props.summary} />
        </div>
        <p className="temp">{this.props.temperature}</p>
      </div>
    )
  }
}
