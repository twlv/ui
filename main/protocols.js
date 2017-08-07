const { protocol } = require('electron');
const path = require('path');
const fs = require('fs-extra');

const SCHEMES = [ 'twlv' ];

function setup () {
  protocol.registerFileProtocol('twlv', async (req, cb) => {
    let filePath = path.resolve(__dirname, '../app', req.url.slice(7));
    let stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    cb(filePath);
  });
}

module.exports = { setup, SCHEMES };
