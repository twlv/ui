const { app, protocol } = require('electron');
const signal = require('./main/signal');
const protocols = require('./main/protocols');
const { ensureWindow } = require('./main/windows');
const config = require('./main/config');
const argv = require('minimist')(process.argv);
const path = require('path');
const ipc = require('./main/ipc');

if (argv['data-dir']) {
  app.setPath('userData', path.resolve(argv['data-dir']));
}

signal.setup();

config.setup(app.getPath('userData'));

protocol.registerStandardSchemes(protocols.SCHEMES, { secure: true });

app.on('ready', () => {
  protocols.setup();
  ipc.setup();

  ensureWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  ensureWindow();
});
