const path = require('path');
const fs = require('fs-extra');

class Config {
  constructor (type, dataDir = path.resolve('data'), persistDelay = 500) {
    this.type = type;
    this.values = {
      dataDir,
    };
    this.defaultValues = {
      port: 12000,
    };

    try {
      this.load(path.resolve(dataDir, type === 'client' ? 'twlv.json' : 'twlvd.json'));
    } catch (err) {
      console.error(`Cannot load config from ${this.file}`, err);
    }
  }

  load (file) {
    this.file = path.resolve(file);
    fs.ensureFileSync(this.file);

    let content = fs.readFileSync(this.file, 'utf8');
    this.values = Object.assign(this.values, content ? JSON.parse(content) : {});

    if (this.type !== 'daemon') {
      this.timeout = setTimeout(() => this.persist(), this.persistDelay);
    }
  }

  get (key) {
    return this.values[key] || this.defaultValues[key];
  }

  set (key, value) {
    if (this.type === 'daemon') {
      throw new Error('Daemon config is readonly');
    }
    this.values[key] = value;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.persist(), this.persistDelay);
  }

  persist () {
    fs.writeFile(this.file, JSON.stringify(this.values));
  }
}

let clientConfig;
let daemonConfig;
function setup (userDir) {
  daemonConfig = new Config('daemon', userDir);
  clientConfig = new Config('client', userDir);
}

function get (type, key) {
  if (type === 'daemon') {
    return daemonConfig.get(key);
  } else if (type === 'client') {
    return clientConfig.get(key);
  } else {
    throw new Error('Config available is client or daemon');
  }
}

function set (type, key, value) {
  if (type === 'daemon') {
    return daemonConfig.set(key, value);
  } else if (type === 'client') {
    return clientConfig.set(key, value);
  } else {
    throw new Error('Config available is client or daemon');
  }
}

module.exports = { setup, get, set, Config };
