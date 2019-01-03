const electron = require('electron');
var log = require('electron-log')
const { app, BrowserWindow } = require('electron');

function createWindow() {
  win = new BrowserWindow();
  win.loadFile('index.html');
  win.on('closed', () => {
    app.quit();
  });
  log.info("Create window!")
}

let win;

app.on('ready', createWindow);

