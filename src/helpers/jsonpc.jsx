export default function jsonpc(uri, callback) {
  // JSONP - If the URL includes the string "callback=?" (or similar, as defined by the server-side API), the request is treated as JSONP instead.
  // Script and JSONP requests are not subject to the same origin policy restrictions.
  // This works by inserting a function (downloaded from the api endpoint) that returns a json (conatining the api data) into a <script> tag (which is immediatly called).
  var id = '_' + Math.round(10000 * Math.random());
  var callbackName = 'jsonp_callback_' + id;
  var src = uri + (uri.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;

  var script = document.createElement("script");
  script.src = src;

  window[callbackName] = function(json) {
      console.log(json)
      delete window[callbackName];
      document.head.removeChild(script);
      callback(json)
  };

  document.head.appendChild(script);
}
