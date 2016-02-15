import React, { Component } from 'react';

export class Lockscren extends Component {
  render() {
    return (
      <div class="currentInfo">
        <p class="clock"></p>
        <p class="today"></p>
      </div>

      <div class="mainWeather">
        <p class="location">Location</p>
        <p class="summary">Summary</p>
        <p class="temperature">º</p>
      </div>

      <div class="weaStampWrapper">
        <div class="weaStamp">
          <p class="weatherAt">Now</p>
          <div class="wrapperCeption">
            <div class="wrapper">
              <canvas id="iconNow" width="154" height="154"></canvas>
            </div>
          </div>
          <p class="tempAt now">º</p>
        </div>

        <div class="weaStamp hourOne">
          <p class="weatherAt">0AM/PM</p>
          <div class="wrapperCeption">
            <div class="wrapper">
              <canvas id="iconHourOne" width="154" height="154"></canvas>
            </div>
          </div>
          <p class="tempAt oneHrLater">º</p>
        </div>

        <div class="weaStamp hourTwo">
          <p class="weatherAt">0AM/PM</p>
          <div class="wrapperCeption">
            <div class="wrapper">
              <canvas id="iconHourTwo" width="154" height="154"></canvas>
            </div>
          </div>
          <p class="tempAt twoHrLater">º</p>
        </div>

        <div class="weaStamp hourThree">
          <p class="weatherAt">0AM/PM</p>
          <div class="wrapperCeption">
            <div class="wrapper">
              <canvas id="iconHourThree" width="154" height="154"></canvas>
            </div>
          </div>
          <p class="tempAt threeHrLater">º</p>
        </div>

        <div class="weaStamp hourFour">
          <p class="weatherAt">0AM/PM</p>
          <div class="wrapperCeption">
            <div class="wrapper">
              <canvas id="iconHourFour" width="154" height="154"></canvas>
            </div>
          </div>
          <p class="tempAt fourHrLater">º</p>
        </div>
      </div> 
    );
  }
}
