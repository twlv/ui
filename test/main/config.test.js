const { Config } = require('../../main/config');
const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');

describe('Config', () => {
  beforeEach(() => {
    fs.ensureFileSync('data/config-alt.json');
    fs.ensureFileSync('data/config.json');
    fs.writeFileSync('data/config-alt.json', JSON.stringify({
      foo: 'bar',
    }));

    fs.writeFileSync('data/config.json', JSON.stringify({
      foo: 'foo',
    }));
  });

  afterEach(() => {
    fs.removeSync('data');
  });

  describe('constructor', () => {
    it('create new instance', () => {
      let config = new Config();
      assert(config);
      assert.equal(config.file, path.resolve('data/config.json'));
    });
  });

  describe('#load()', () => {
    it('load from file', () => {
      let config = new Config();
      config.load('data/config-alt.json');
      assert(config.file, path.resolve('data/config-alt.json'));
      assert.equal(config.get('foo'), 'bar');
    });
  });

  describe('#get()', () => {
    it('get data from config', () => {
      let config = new Config();
      assert.equal(config.get('foo'), 'foo');
    });
  });

  describe('#set()', () => {
    it('set data to config', () => {
      let config = new Config();
      assert.equal(config.get('foo'), 'foo');
      config.set('foo', 'baz');
      config.set('zzz', 'zzz');

      assert.equal(config.get('foo'), 'baz');
      assert.equal(config.get('zzz'), 'zzz');
    });

    it('auto persist data after 500 ms', async () => {
      let config = new Config();
      config.set('foo', 'fooz');
      config.set('bar', 'barz');
      config.set('baz', 'bazz');

      await new Promise(resolve => setTimeout(resolve, 600));

      let c = JSON.parse(fs.readFileSync(config.file));
      assert.equal(c.foo, 'fooz');
      assert.equal(c.bar, 'barz');
      assert.equal(c.baz, 'bazz');
    });
  });
});
