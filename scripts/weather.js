$(function() {
  // CLOCK

  function getTime() {
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    $(".clock").text(strTime);
  }

  getTime();
  var int = setInterval(getTime, 5000);



//
  var successCallback = function(position){
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    displayLocation(x,y);
    getWeatherData(x,y);
  };

  var errorCallback = function(error){
    var errorMessage = 'Unknown error';
    switch(error.code) {
      case 1:
        errorMessage = 'Permission denied';
        break;
      case 2:
        errorMessage = 'Position unavailable';
        break;
      case 3:
        errorMessage = 'Timeout';
        break;
    }
    console.log(errorMessage);
  };

  var options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(successCallback,errorCallback,options);

  // Get city from longitude and latitude

  function displayLocation(latitude,longitude) {
    var request = new XMLHttpRequest();

    var method = 'GET';
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
    var async = true;



    request.open(method, url, async);
    request.onreadystatechange = function(){
      if (request.readyState == 4 && request.status == 200) {
        var data = JSON.parse(request.responseText);
        var address = data.results[0];
        var formattedAddress = address.formatted_address;
        var removeStreetAdr = formattedAddress.substring(formattedAddress.indexOf(",")+1)
        var removeCountry = removeStreetAdr.substr(0, removeStreetAdr.lastIndexOf(","));
        var withNoDigits = removeCountry.replace(/[0-9]/g, '');
        console.log(withNoDigits);
          $('.location').text(withNoDigits);
      }
    };
    request.send();
  };

  var apiKey = '5485362f69ad87b5aaa04281f19ce344';
  var urlForecast = 'https://api.forecast.io/forecast/';
  var data;
  var latitude;
  var longitude;

  // Get weather data
  function getWeatherData(latitude, longitude) {
    $.getJSON(urlForecast + apiKey + "/" + latitude + "," + longitude + "?callback=?", function(data) {

      console.log(data);

      function milToStandard(value) {
        if (value !== null && value !== undefined){ //If value is passed in
          if(value.indexOf('AM') > -1 || value.indexOf('PM') > -1){ //If time is already in standard time then don't format.
            return value;
          }
          else {
            if(value.length == 8){ //If value is the expected length for military time then process to standard time.
              var hour = value.substring ( 0,2 ); //Extract hour
              var minutes = value.substring ( 3,5 ); //Extract minutes
              var identifier = 'AM'; //Initialize AM PM identifier

              if(hour == 12){ //If hour is 12 then should set AM PM identifier to PM
                identifier = 'PM';
              }
              if(hour == 0){ //If hour is 0 then set to 12 for standard time 12 AM
                hour=12;
              }
              if(hour > 12){ //If hour is greater than 12 then convert to standard 12 hour format and set the AM PM identifier to PM
                hour = hour - 12;
                identifier='PM';
              }
              return hour + ':' + minutes + ' ' + identifier; //Return the constructed standard time
            }
            else { //If value is not the expected length than just return the value as is
              return value;
            }
          }
        }
      };

      var currTemp = data.currently.temperature;
      currTemp = Math.round(currTemp);
      $('.temperature').html(currTemp+"º");

      var summary = data.currently.summary;
      $('.summary').text(summary);

      var d = new Date();
      var weekday = new Array(7);
      weekday[0] =  "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      var n = weekday[d.getDay()];
      $('.dayOfWeek').text(n);

      var highTemp = data.daily.data[0].temperatureMax;
      highTemp = Math.round(highTemp);
      $('.highTemp').text(highTemp+"º");

      var lowTemp = data.daily.data[0].temperatureMin;
      lowTemp = Math.round(lowTemp);
      $('.lowTemp').text(lowTemp+"º");

      var timeOneHr = data.hourly.data[1].time;
      timeOneHr = timeOneHr * 1000;
      var oneHrToString = timeOneHr.toString();
      var oneHrTimeFormat = new Date(timeOneHr).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      var oneHrLaterSplit = milToStandard(oneHrTimeFormat).split(":")
      var oneHrLater = parseInt(oneHrLaterSplit[0]) + " " + oneHrLaterSplit[1].split(" ")[1];
      console.log(oneHrLater);
      oneHrLater.replace(':00','');
      console.log(oneHrLater);
      $('.hourOne > p.weatherAt').text(oneHrLater.split(":"));

      var timeTwoHr = data.hourly.data[2].time;
      timeTwoHr = timeTwoHr * 1000;
      var twHrToString = timeTwoHr.toString();
      var twoHrTimeFormat = new Date(timeTwoHr).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      var twoHrLaterSplit = milToStandard(twoHrTimeFormat).split(":")
      var twoHrLater = parseInt(twoHrLaterSplit[0]) + " " + twoHrLaterSplit[1].split(" ")[1];
      $('.hourTwo > p.weatherAt').text(twoHrLater);

      var timeThreeHr = data.hourly.data[3].time;
      timeThreeHr = timeThreeHr * 1000;
      var threeHrToString = timeThreeHr.toString();
      var threeHrTimeFormat = new Date(timeThreeHr).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      var threeHrLaterSplit = milToStandard(threeHrTimeFormat).split(":")
      var threeHrLater = parseInt(threeHrLaterSplit[0]) + " " + threeHrLaterSplit[1].split(" ")[1];
      $('.hourThree > p.weatherAt').text(threeHrLater);

      var timeFourHr = data.hourly.data[4].time;
      timeFourHr = timeFourHr * 1000;
      var fourHrToString = timeFourHr.toString();
      var fourHrTimeFormat = new Date(timeFourHr).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      var fourHrLaterSplit = milToStandard(fourHrTimeFormat).split(":")
      var fourHrLater = parseInt(fourHrLaterSplit[0]) + " " + fourHrLaterSplit[1].split(" ")[1];
      $('.hourFour > p.weatherAt').text(fourHrLater);

      $('.now').text(currTemp+"º");


      var tempOneHr = data.hourly.data[1].temperature;
      tempOneHr = Math.round(tempOneHr);
      $('.oneHrLater').text(tempOneHr+"º");

      var tempTwoHr = data.hourly.data[2].temperature;
      tempTwoHr = Math.round(tempTwoHr);
      $('.twoHrLater').text(tempTwoHr+"º");

      var tempThreeHr = data.hourly.data[3].temperature;
      tempThreeHr = Math.round(tempThreeHr);
      $('.threeHrLater').text(tempThreeHr+"º");

      var tempFourHr = data.hourly.data[4].temperature;
      tempFourHr = Math.round(tempFourHr);
      $('.fourHrLater').text(tempFourHr+"º");


      // WEATHER ICON SHENANIGANS FOR CHRIS TOPHY GERVANG

      var icons = new Skycons({
        "monochrome": true,
        "color": "#ecf0f1",
        // "colors" : {
        //   "cloud" : "#F00"
        // }
      });

      icons.set('iconNow', data.hourly.data[0].icon);
      icons.set('iconHourOne', data.hourly.data[1].icon);
      icons.set('iconHourTwo', data.hourly.data[2].icon);
      icons.set('iconHourThree', data.hourly.data[3].icon);
      icons.set('iconHourFour', data.hourly.data[4].icon);

      icons.play();
      // var iconNow = data.currently.icon;
      // if iconNow == "partly-cloudy-night" {
      //
      // }





      var chanceOfRain = data.daily.data[0].precipProbability;
      chanceOfRain = chanceOfRain * 100;
      $('.chanceOfRainData').text(chanceOfRain+"%");

      var sunriseTime = data.daily.data[0].sunriseTime;
      var secToMil = sunriseTime * 1000;  // convert to milliseconds
      var toString = secToMil.toString(); // convert to string
      var milSecToTimeFormat = new Date(secToMil).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

      var sunsetTime = data.daily.data[0].sunsetTime;
      sunsetTime = sunsetTime * 1000; // convert to milliseconds
      var sunsetTimeToString = sunsetTime.toString(); // convert to string
      var sunsetToTimeFormat = new Date(sunsetTime).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

      var sunriseData = milToStandard(milSecToTimeFormat);
      sunriseData = sunriseData.replace(/^0/, '');
      $('.sunriseData').text(sunriseData);

      var sunsetData = milToStandard(sunsetToTimeFormat);
      sunsetData = sunsetData.replace(/^0/, '');
      $('.sunsetData').text(sunsetData);

      var humidity = data.currently.humidity;
      var decToPer = humidity * 100;
      $('.humidityData').html(decToPer+"%");

      var windSpeed = data.daily.data[0].windSpeed;
      $('.windData').text(windSpeed+" mph");

      var feelsLike = data.currently.apparentTemperature;
      feelsLike = Math.round(feelsLike);
      $('.feelsLikeData').text(feelsLike+"º");

      var precipitation = data.daily.data[0].precipIntensity;
      precipitation = precipitation.toFixed(2);
      $('.precipitationData').text(precipitation+" in/hr");

      var precipitationType = data.daily.data[0].precipType;
      $('.precipitationTypeData').text(precipitationType);
    });
  }
});
