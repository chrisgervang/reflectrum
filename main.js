var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

//http server
var http = require('http');
var path = require('path');
var fs = require('fs');

// Report crashes to our server.
require('crash-reporter').start();

// Prevent the computer from going to sleep
const powerSaveBlocker = require('electron').powerSaveBlocker;
var id = powerSaveBlocker.start('prevent-display-sleep');
console.log(powerSaveBlocker.isStarted(id));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  function requestHandler(req, res) {
    var
    file    = req.url == '/' ? '/app.html' : req.url,
    root    = __dirname + '/',
    page404 = root + '/404.html';
    console.log((root + file))
    getFile((root + file), res, page404);
  };

  // start a simple server that can serve an html page and resolve local file loading.
  var server = http.createServer(requestHandler).listen(3000);

  // Put the app on a secondary display if availalbe
  var atomScreen = require('screen');
  var displays = atomScreen.getAllDisplays();
  var externalDisplay = null;
  for (var i in displays) {
    if (displays[i].bounds.x > 0 || displays[i].bounds.y > 0) {
      externalDisplay = displays[i];
      break;
    }
  }

  var browserWindowOptions = {
    width: 800,
    height: 600,
    kiosk:true,
    autoHideMenuBar:true,
    darkTheme:true,
    "node-integration": false
  };
  if (!!externalDisplay) {
    browserWindowOptions.x = externalDisplay.bounds.x + 50;
    browserWindowOptions.y = externalDisplay.bounds.y + 50
  }

  var openWindow = function(){
    // Create the browser window.
    mainWindow = new BrowserWindow(browserWindowOptions);

    // and load the index.html of the app.
    mainWindow.loadURL("http://localhost:3000/app.html");

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // BrowserWindow.addDevToolsExtension('~/code/react-devtools/shells/plain');


    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  };

  function getFile(filePath, res, page404) {

    fs.exists(filePath, function(exists) {
      if(exists) {
        fs.readFile(filePath, function(err, contents) {
          if(!err) {
            res.end(contents);
          } else {
            console.dir(err);
          }
        });
      } else {
        fs.readFile(page404, function(err, contents) {
          if(!err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(contents);
          } else {
            console.dir(err);
          }
        });
      }
    });
  };

  openWindow();
});
