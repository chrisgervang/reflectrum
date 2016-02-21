import jsonpc from './jsonpc';
import moment from 'moment';

export function getWeatherData(latitude, longitude, apiKey, callback) {
  console.log(latitude, longitude)
  var uri = "https://api.forecast.io/forecast/" + apiKey + "/" + latitude + "," + longitude;
  jsonpc(uri, callback);
}

export function parseWeather(weather) {
  var data = {
    stamps: [],
    summary: weather.currently.summary,
    temperature: Math.round(weather.currently.temperature) + "º"
  }

  for(var i = 0; i < 5; i++) {
    var hour = weather.hourly.data[i]
    var hourStamp = {
      time: moment(hour.time * 1000).format("hA"),
      icon: hour.icon,
      temperature: Math.round(hour.temperature) + "º"
    }

    //The first weather stamp labeled "Now" to indicate present.
    if (i === 0) hourStamp.time = "Now";

    data.stamps.push(hourStamp)
  }

  return data
}

// export class WeatherParser {
//   static hourStamp(hour) {
//     var time = moment(hour.time * 1000).format("hA")
//     return {
//       time: time,
//       icon: hour.icon,
//       tempf: Math.round(hour.tempurature)
//     }
//   }
//
//
// }
