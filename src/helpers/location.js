export function getCurrentPosition(callback) {

  var successCallback = function(position){
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    callback({lat: x,long: y, status: "SUCCESS"});
    // getWeatherData(x,y);
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
    callback({status: "ERROR"})
  };

  var options = {
    enableHighAccuracy: false,
    timeout: 20000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(successCallback,errorCallback,options);
}

export function lat_longToAddress(latitude, longitude, callback) {
  fetch('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true').then((response) => {
    if(response.ok) {
      response.json().then((data) => {
        console.log(data)
        if (data.status === "ZERO_RESULTS") {
          callback("Location Unknown");
        } else {
          var address = data.results[0];
          var formattedAddress = address.formatted_address;
          var removeStreetAdr = formattedAddress.substring(formattedAddress.indexOf(",")+1)
          var removeCountry = removeStreetAdr.substr(0, removeStreetAdr.lastIndexOf(","));
          var withNoDigits = removeCountry.replace(/[0-9]/g, '');
          console.log(withNoDigits);
          callback(withNoDigits);
        }
      })
    } else {
      callback("Network Error")
    }
  });
};
