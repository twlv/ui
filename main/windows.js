const { BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const { get, set } = require('./config');

let instances = [];

function createWindow () {
  let lastWindow = get('client', 'lastWindow') || { width: 1024, height: 700, devTools: false };
  let { width, height, devTools } = lastWindow;
  let win = new BrowserWindow({ width, height });
  // let win = new BrowserWindow({ width, height, frame: false });

  let winUrl = url.format({
    pathname: path.join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  win.loadURL(winUrl);

  if (process.env.TWLV_DEBUG_SHELL || devTools) {
    win.webContents.openDevTools();
  }

  win.on('resize', function () {
    let [ width, height ] = win.getSize();

    lastWindow.height = height;
    lastWindow.width = width;

    set('client', 'lastWindow', lastWindow);
  });

  win.on('closed', function () {
    let index = instances.indexOf(win);
    if (index !== -1) {
      instances.splice(index, 1);
    }
  });

  instances.push(win);

  return win;
}

function ensureWindow () {
  if (!instances.length) {
    createWindow();
  }

  return instances[0];
}

module.exports = { createWindow, ensureWindow };
