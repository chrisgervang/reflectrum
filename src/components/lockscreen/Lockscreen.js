import React, { Component } from 'react';
import './lockscreen.css!';
import { Skycons } from 'maxdow/skycons'

export class Lockscreen extends Component {
  render() {
    return (
      <div>
        <div className="currentInfo">
          <p className="big-clock"></p>
          <p className="today"></p>
        </div>

        <div className="mainWeather">
          <p className="location">Location</p>
          <p className="summary">Summary</p>
          <p className="temperature">º</p>
        </div>

        <div className="weaStampWrapper">
          <div className="weaStamp">
            <p className="weatherAt">Now</p>
            <div className="wrapperCeption">
              <div className="wrapper">
                <canvas id="iconNow" width="154" height="154"></canvas>
              </div>
            </div>
            <p className="tempAt now">º</p>
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
      </div>
    );
  }
}
