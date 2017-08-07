const { app } = require('electron');

function setup () {
  ['SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK'].forEach((signal) => {
    process.on(signal, () => {
      app.quit();
    });
  });
}

module.exports = { setup };
