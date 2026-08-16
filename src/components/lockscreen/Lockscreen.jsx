import React, { Component } from 'react';
import moment from 'moment';
import { MirrorEvents } from '../../helpers/events';
import { resolveLocation } from '../../providers/location';
import { fetchWeather } from '../../providers/weather';
import Clock from '../common/Clock';
import { WeatherStamp } from './WeatherStamp';
import Row from '../common/Row';
import './lockscreen.css';

export class Lockscreen extends Component {
  state = {
    time: Clock.getTime({ ampm: false }),
    status: 'loading',
    weather: null,
    error: '',
  };

  componentDidMount() {
    this.clockInterval = setInterval(() => {
      const time = Clock.getTime({ ampm: false });
      if (time !== this.state.time) this.setState({ time });
    }, 5000);

    this.handlers = [
      MirrorEvents.addListener('SECONDARY_HOLD', this.props.secondaryHold),
      MirrorEvents.addListener('SECONDARY_CLICK', this.props.secondaryClick),
    ];

    this.abortController = new AbortController();
    this.loadWeather();
  }

  componentWillUnmount() {
    clearInterval(this.clockInterval);
    this.abortController.abort();
    this.handlers.forEach((handler) => handler.remove());
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
    const { time, status, weather, error } = this.state;
    return (
      <div>
        <p className="animated fadeIn big-clock">{time}</p>
        <p className="animated fadeIn today">{moment().format('ddd, MMMM Do')}</p>
        <p className="animated fadeIn location">
          {status === 'ready' ? weather.location : status === 'loading' ? 'Loading weather…' : 'Weather unavailable'}
        </p>
        {status === 'ready' && (
          <>
            <p className="animated fadeIn summary">{weather.current.summary}</p>
            <p className="animated fadeIn temperature">{weather.current.temperature}</p>
            <Row>
              {weather.hours.map((hour) => <WeatherStamp key={hour.time} {...hour} />)}
            </Row>
          </>
        )}
        {status === 'error' && <p className="lockscreen-weather-error">{error}</p>}
      </div>
    );
  }
}
