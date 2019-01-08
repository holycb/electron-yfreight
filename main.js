const electron = require('electron');
var log = require('electron-log')
var dbhelper = require('./js/dbhelper.js');
const { app, BrowserWindow } = require('electron');

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 1000,
    height: 600,
    minWidth: 930,
    minHeight: 400
  });
  win.loadFile('index.html');
  win.on('closed', () => {
    app.quit();
  });
  log.info("Create window!")
  // win.on('close', function() {
  //   dbhelper.dbClose();
  // });
}

let win;

app.on('ready', createWindow);

