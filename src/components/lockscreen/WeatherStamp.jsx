import React, {Component} from 'react';
import './WeatherStamp.css';

const weatherGlyph = (icon) => {
  const glyphs = {
    'clear-day': '☀',
    'clear-night': '☾',
    rain: '☂',
    snow: '❄',
    sleet: '◇',
    wind: '≋',
    fog: '≡',
    cloudy: '☁',
    'partly-cloudy-day': '⛅',
    'partly-cloudy-night': '☁',
  };
  return glyphs[icon] || '•';
};


export class WeatherStamp extends Component {
  render() {

    return (
      <div className="animated flipInY weather-stamp">
        <p className="time">{this.props.time}</p>
        <div className="icon">
          <div className="canvas-sizer" aria-hidden="true" style={{fontSize: '96px'}}>
            {weatherGlyph(this.props.icon)}
          </div>
        </div>
        <p className="temp">{this.props.temperature}</p>
      </div>
    )
  }
}
