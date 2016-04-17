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

  // navigator.geolocation.getCurrentPosition(successCallback,errorCallback,options);

  successCallback(
    {
      coords: {
        latitude: 39.9500,
        longitude: -75.1667
      }
    }
  );

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
        console.log(data)
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

  var data;
  var latitude;
  var longitude;

  // Get weather data
  function getWeatherData(latitude, longitude) {

    var apiKey = '5485362f69ad87b5aaa04281f19ce344';
    var urlForecast = 'https://api.forecast.io/forecast/';

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

      // Indexes for time and temp
      var dataIndex = [0, 1, 2, 3, 4];
      var timeClass = [".now", ".hourOne", ".hourTwo", ".hourThree", ".hourFour"];
      var tempClass = [".nowHr", ".oneHrLater", ".twoHrLater", ".threeHrLater", ".fourHrLater"];
      var iconClass = ["iconNow", "iconHourOne", "iconHourTwo", "iconHourThree", "iconHourFour"];

      var icons = new Skycons({
        "monochrome": false,
        // "color": "#ecf0f1",
        "colors" : {
          "cloud" : "#bdc3c7",
          "sun" : "#FFDC00",
          "leaf" : "#2ecc71"
        }
      });

      console.log(data.hourly.data);

      for (var i = 0; i < dataIndex.length; i++) {
        // Time
        if (timeClass[i] != ".now") {
          var timeHr = data.hourly.data[dataIndex[i]].time * 1000;
          var hrTimeFormat = new Date(timeHr).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
          var hourLaterSplit = milToStandard(hrTimeFormat).split(":");
          var hrLater = parseInt(hourLaterSplit[0]) + " " + hourLaterSplit[1].split(" ")[1];
          $(timeClass[i] + ' > p.weatherAt').text(hrLater);
        };

        // Icons
        icons.set(iconClass[i], data.hourly.data[dataIndex[i]].icon);

        // Temperature
        var tempHr = Math.round(data.hourly.data[dataIndex[i]].temperature);
        $(tempClass[i]).text(tempHr+"º");
      }

      icons.play();

      var chanceOfRain = data.daily.data[0].precipProbability;
      chanceOfRain = chanceOfRain * 100;
      $('.chanceOfRainData').text(chanceOfRain+"%");

      var sunriseTime = data.daily.data[0].sunriseTime;
      var secToMil = sunriseTime * 1000;  // convert to milliseconds
      var milSecToTimeFormat = new Date(secToMil).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");

      var sunsetTime = data.daily.data[0].sunsetTime;
      sunsetTime = sunsetTime * 1000; // convert to milliseconds
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
