const TabGroup = require('electron-tabs');

let tabGroup = new TabGroup();

let tab = tabGroup.addTab({
  title: '...',
  closable: false,
  src: 'twlv://ui',
  visible: true,
  active: true,
  webviewAttributes: {
    preload: './preload.js',
  },
  ready: tab => {
    // Open dev tools for webview
    let webview = tab.webview;
    if (webview) {
      webview.addEventListener('dom-ready', () => {
        webview.openDevTools();
      });

      webview.addEventListener('page-title-updated', evt => {
        tab.setTitle(evt.title);
      });
    }
  },
});
