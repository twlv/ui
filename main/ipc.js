const { ipcMain } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const { get } = require('./config');

function setup () {
  ipcMain.on('twlv-daemon-definition', (evt, arg) => {
    console.info('ipc:twlv-daemon-definition');

    let pid = getPid();
    let { port } = getDaemonDefinition();
    evt.returnValue = { pid, port };
  });
}

function getPid () {
  let pidFile = path.resolve(get('client', 'dataDir'), 'twlvd.pid');
  let pid = null;
  if (fs.existsSync(pidFile)) {
    pid = Number(fs.readFileSync(pidFile).toString());
  }
  return pid;
}

function getDaemonDefinition () {
  let port = get('daemon', 'port') || 12000;
  return { port };
}

module.exports = { setup };
