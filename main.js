const electron = require('electron');
const { app, BrowserWindow } = require('electron');

function createWindow() {
  win = new BrowserWindow();
  win.loadFile('index.html');
  win.on('closed', () => {
    app.quit();
  });
}

let win;

app.on('ready', createWindow);

