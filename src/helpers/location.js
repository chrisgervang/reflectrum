export function getCurrentPosition(callback) {
  //check if component is mounted before allowing callbacks to change state with this property.

  let gpsRequest = new Promise((resolve, reject) => {

    var successCallback = function(position){
      var x = position.coords.latitude;
      var y = position.coords.longitude;
      resolve({lat: x,long: y});
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
      reject(errorMessage)
    };

    var options = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(successCallback,errorCallback,options);
  })

  const cancelablePromise = makeCancelable(
    gpsRequest
  );

  return cancelablePromise;

}

export function lat_longToCity(latitude, longitude) {
  let api = fetch('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true')

  let addressParser = new Promise((resolve, reject) => {

    api.then((response) => {
      if(response.ok) {
        response.json().then((data) => {
          console.log(data)
          if (data.status === "ZERO_RESULTS") {
            resolve("Location Unknown")
          } else {
            var address = data.results[0].formatted_address;
            var removeStreetAdr = address.substring(address.indexOf(",") + 1);
            var removeCountry = removeStreetAdr.substr(0, removeStreetAdr.lastIndexOf(","));
            var withNoDigits = removeCountry.replace(/[0-9]/g, '');
            console.log(withNoDigits);
            resolve(withNoDigits)
          }
        });
      } else {
        // console.log("NETWORK ERROR")
        reject("Fetch Address: Network Error");
      }
    });

  });

  const cancelablePromise = makeCancelable(
    addressParser
  );

  return cancelablePromise;
};

const makeCancelable = (promise) => {
  let hasCanceled_ = false;


  return {
    promise: new Promise(
      (resolve, reject) => promise
        .then(r => hasCanceled_
          ? reject({isCanceled: true})
          : resolve(r)
        )
    ),
    cancel() {
      hasCanceled_ = true;
    },
  };
};
