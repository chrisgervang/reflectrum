import React, { Component } from 'react';
import Skycons from 'maxdow/skycons'
import moment from 'moment';
import {getWeatherData, parseWeather} from '../../helpers/weather.js'
import {getCurrentPosition, lat_longToAddress} from '../../helpers/location.js'
import { MirrorEvents } from '../../helpers/events';

//components
import Clock from '../common/Clock';
import { WeatherStamp } from './WeatherStamp'
import Row from '../common/Row'

//css
import './Lockscreen.css!';

//TODO: scrolling weather stamp (like iOS). up/down scrolls horizontally. fit 4 & 1/2 icons in row

export class Lockscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: Clock.getTime({"ampm": false}),
      location: "Finding Location...",
      weather: null
    }

  }

  componentDidMount() {
    //cancelable promise
    this.gpsRequest = getCurrentPosition();

    //clock loop
    this.int = setInterval(() => {
      var time = Clock.getTime({"ampm": false});
      if (time != this.state.time) {
        this.setState({time: time});
      }
    }, 5000);

    //handlers
    this.handlers = []
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_HOLD', () => {
        this.props.secondaryHold()
      })
    );
    this.handlers.push(
      MirrorEvents.addListener('SECONDARY_CLICK', () => {
        this.props.secondaryClick()
      })
    );

    //location, weather
    const locationCache = this.props.locationCache;
    // const location = {long: -119, lat: 39};

    const _gatherState = (location) => {

      //cancelable promise
      this.lat_long = lat_longToAddress(location.lat, location.long);

      this.lat_long.promise
      .then((location) => {
        //console.log("LAT LONG", location)
        this.setState({location: location});
      })
      .catch((reason) => {
        console.log(reason);
      });

      getWeatherData(location.lat, location.long, this.props.forecastIOapiKey, (weather) => {
        this.setState({weather: parseWeather(weather)});
      });
    }

    // either use cached location or HTML5 current location promise.
    if (locationCache) {
      _gatherState(locationCache)
    } else {
      this.gpsRequest.promise
      .then((data) => {
        _gatherState(data)
      })
      .catch((reason) => {
        console.log(reason);
        this.setState({location: "Location Unknown"})
      });
    }
  }


  componentWillUnmount() {
    //remove clock loop
    clearInterval(this.int)

    //cancel gps request to prevent changing state when component is unmounted.
    if(!!this.gpsRequest) {
      this.gpsRequest.cancel();
    }

    if(!!this.lat_long) {
      this.lat_long.cancel();
    }


    //remove handlers
    this.handlers.map((handler) =>{
      handler.remove();
    })
  }

  render() {
    const state = this.state
    const today = moment().format("ddd, MMMM Do")
    let stamps = null
    let summary = null
    let temperature = null

    if (state.weather !== null) {
      stamps = state.weather.stamps.map((stamp, i) => {
        return (
          <WeatherStamp key={i} {...stamp}></WeatherStamp>
        )
      })

      summary = <p className="animated fadeIn summary">{state.weather.summary}</p>

      temperature = <p className="animated fadeIn temperature">{state.weather.temperature}</p>

    }

    return (
      <div>
        <p className="animated fadeIn big-clock">{state.time}</p>
        <p className="animated fadeIn today">{today}</p>
        <p className="animated fadeIn location">{state.location}</p>
        {summary}
        {temperature}
        <Row>
          {stamps}
        </Row>

      </div>
    );
  }
}
