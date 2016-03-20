import React, { Component } from 'react';
import {connect} from 'react-redux';
import './Weather.css!'

class Weather extends Component {
  render() {
    return (
      <div className="gggg">

        <p className="clock"></p>

        <div className="weaHead">
          <div className="container">
            <p className="location">City, State</p>
            <p className="summary">Summary</p>
          </div>
          <p className="temperature">º</p>
        </div>

        <div className="weaDetail">
          <ul className="detailUL">
            <li className="dayOfWeek left"></li>
            <li className="today left">Today</li>
            <li className="lowTemp right">Lowº</li>
            <li className="highTemp right">Highº</li>
          </ul>
        </div>

        <hr className="line" />

        <div className="weaStampWrapper">
          <div className="weaStamp now">
            <p className="weatherAt">Now</p>
            <div className="wrapperCeption">
              <div className="wrapper">
                <canvas id="iconNow" width="154" height="154"></canvas>
              </div>
            </div>
            <p className="tempAt nowHr">º</p>
          </div>

          <div className="weaStamp hourOne">
            <p className="weatherAt">0AM/PM</p>
            <div className="wrapperCeption">
              <div className="wrapper">
                <canvas id="iconHourOne" width="154" height="154"></canvas>
              </div>
            </div>
            <p className="tempAt oneHrLater">º</p>
          </div>

          <div className="weaStamp hourTwo">
            <p className="weatherAt">0AM/PM</p>
            <div className="wrapperCeption">
              <div className="wrapper">
                <canvas id="iconHourTwo" width="154" height="154"></canvas>
              </div>
            </div>
            <p className="tempAt twoHrLater">º</p>
          </div>

          <div className="weaStamp hourThree">
            <p className="weatherAt">0AM/PM</p>
            <div className="wrapperCeption">
              <div className="wrapper">
                <canvas id="iconHourThree" width="154" height="154"></canvas>
              </div>
            </div>
            <p className="tempAt threeHrLater">º</p>
          </div>

          <div className="weaStamp hourFour">
            <p className="weatherAt">0AM/PM</p>
            <div className="wrapperCeption">
              <div className="wrapper">
                <canvas id="iconHourFour" width="154" height="154"></canvas>
              </div>
            </div>
            <p className="tempAt fourHrLater">º</p>
          </div>
        </div>

        <hr className="line2"/>

        <div className="container">
          <div className="details">
            <div className="detailsWrapper">
              <div className="detailsLeft">
                <p className="right sunrise">Sunrise:</p>
                <p className="right sunset">Sunset:</p>
                <br />
                <p className="right chanceOfRain">Chance of rain:</p>
                <p className="right humidity">Humidity:</p>
                <br />
                <p className="right wind">Wind</p>
                <p className="right feelsLike">Feels like:</p>
                <br />
                <p className="right precipitation">Precipitation:</p>
                <p className="right precipitationType">Precipitation Type:</p>
              </div>
            </div>
            <div className="detailsWrapper">
              <div className="detailsRight">
                <p className="left sunriseData">00:00 AM</p>
                <p className="left sunsetData">00:00 PM</p>
                <br />
                <p className="left chanceOfRainData">%</p>
                <p className="left humidityData">%</p>
                <br />
                <p className="left windData">mph</p>
                <p className="left feelsLikeData">º</p>
                <br />
                <p className="left precipitationData">0 in/hr</p>
                <p className="left precipitationTypeData">n/a</p>
              </div>
            </div>
          </div>
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
    },
    secondaryClick: () => {
      dispatch({
        type: "BACK"
      })
    }
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

export const WeatherContainer = connect(
  mapStateToProps,mapDispatchToProps
)(Weather)
