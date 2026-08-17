import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './Weather.css';
import { MirrorEvents } from '../../helpers/events';
import { resolveLocation } from '../../providers/location';
import { fetchWeather } from '../../providers/weather';
import { WeatherIcon } from './WeatherIcon';

class Weather extends Component {
  state = { status: 'loading', weather: null, error: '' };

  componentDidMount() {
    this.handlers = [
      MirrorEvents.addListener('SECONDARY_HOLD', this.props.secondaryHold),
      MirrorEvents.addListener('SECONDARY_CLICK', this.props.secondaryClick),
    ];
    this.abortController = new AbortController();
    this.loadWeather();
  }

  componentWillUnmount() {
    this.handlers.forEach((handler) => handler.remove());
    this.abortController.abort();
  }

  async loadWeather() {
    try {
      const location = await resolveLocation(this.props.locationCache);
      const weather = await fetchWeather(location, { signal: this.abortController.signal });
      this.setState({ status: 'ready', weather, error: '' });
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.setState({ status: 'error', error: error.message });
      }
    }
  }

  render() {
    if (this.state.status === 'loading') {
      return <div className="weather-status">Loading live weather…</div>;
    }
    if (this.state.status === 'error') {
      return <div className="weather-status">{this.state.error}</div>;
    }

    const { weather } = this.state;
    return (
      <div className="gggg">
        <p className="clock">{moment().format('h:mm A')}</p>

        <div className="weaHead">
          <div className="container">
            <p className="location">{weather.location}</p>
            <p className="summary">{weather.current.summary}</p>
          </div>
          <p className="temperature">{weather.current.temperature}</p>
        </div>

        <div className="weaDetail">
          <ul className="detailUL">
            <li className="dayOfWeek left">{weather.today.day}</li>
            <li className="todayLabel left">Today</li>
            <li className="lowTemp right">{weather.today.low}</li>
            <li className="highTemp right">{weather.today.high}</li>
          </ul>
        </div>

        <hr className="line" />

        <div className="weaStampWrapper">
          {weather.hours.map((hour) => (
            <div className="weaStamp" key={hour.time}>
              <p className="weatherAt">{hour.time}</p>
              <div className="weather-page-glyph"><WeatherIcon icon={hour.icon} label={hour.summary} /></div>
              <p className="tempAt">{hour.temperature}</p>
              <p className="rainAt">{hour.precipitationChance}</p>
            </div>
          ))}
        </div>

        <hr className="line2" />

        <div className="weather-details-grid">
          <span>Sunrise</span><strong>{weather.today.sunrise}</strong>
          <span>Sunset</span><strong>{weather.today.sunset}</strong>
          <span>Chance of rain</span><strong>{weather.today.precipitationChance}</strong>
          <span>Humidity</span><strong>{weather.current.humidity}</strong>
          <span>Wind</span><strong>{weather.current.wind}</strong>
          <span>Feels like</span><strong>{weather.current.feelsLike}</strong>
          <span>Precipitation</span><strong>{weather.current.precipitation}</strong>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  secondaryHold: () => dispatch({ type: 'OPEN_MAIN_MENU' }),
  secondaryClick: () => dispatch({ type: 'BACK' }),
});

const mapStateToProps = (state) => ({ locationCache: state.locationCache });

export const WeatherContainer = connect(mapStateToProps, mapDispatchToProps)(Weather);
