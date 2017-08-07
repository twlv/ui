const { ipcRenderer } = require('electron');

class Client {
  get definition () {
    if (!this._definition) {
      this._definition = ipcRenderer.sendSync('twlv-daemon-definition');
    }

    return this._definition;
  }

  async get (uri) {
    let response = await window.fetch(this.urlOf(uri));
    if (!response.ok) {
      throw new Error(`Error on response, GET ${uri}`);
    }

    let result = await response.json();
    return result;
  }

  urlOf (uri) {
    return `http://localhost:${this.definition.port}${uri}`;
  }
}

module.exports = { Client };
