const { ModuleRegistry } = require('../../main/modules');
const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');
const swarm = require('../../main/swarm');

let swarmInstance = swarm.setup();

process.on('unhandledRejection', r => {
  console.error('unhandledRejection', r);
});

describe('ModuleRegistry', () => {
  beforeEach(() => {
    fs.removeSync('data');
  });

  afterEach(() => {
    fs.removeSync('data');
  });

  describe('#get()', () => {
    it('get builtin capabilities', () => {
      let registry = new ModuleRegistry(swarmInstance);

      assert('tcp' in registry.channel);
      assert('peer-lookup' in registry.app);

      assert.equal(registry.channel.tcp.type, 'builtin');
    });

    it('get module capabilities', () => {
      fs.mkdirpSync('data/node_modules/twlv-channel-foo');
      fs.mkdirpSync('data/node_modules/twlv-discovery-bar');
      fs.mkdirpSync('data/node_modules/twlv-app-baz');
      fs.mkdirpSync('data/node_modules/something-else');

      let registry = new ModuleRegistry(swarmInstance);

      assert('foo' in registry.channel);
      assert('bar' in registry.discovery);
      assert('baz' in registry.app);

      assert.equal(registry.channel.foo.type, 'module');
      assert.equal(registry.channel.foo.path, path.resolve('data/node_modules/twlv-channel-foo'));
    });
  });

  describe('#install()', () => {
    it('install module to datadir', async () => {
      let registry = new ModuleRegistry(swarmInstance);
      assert.equal('mdns' in registry.discovery, false);
      await registry.install('discovery', 'mdns');
      assert.equal('mdns' in registry.discovery, true);
    }).timeout(20000);
  });

  describe('#uninstall()', () => {
    it('uninstall module from datadir', async () => {
      let registry = new ModuleRegistry(swarmInstance);
      assert.equal('mdns' in registry.discovery, false);
      await registry.install('discovery', 'mdns');
      assert.equal('mdns' in registry.discovery, true);
      await registry.uninstall('discovery', 'mdns');
      assert.equal('mdns' in registry.discovery, false);
    }).timeout(20000);
  });
});
