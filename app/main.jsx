import ReactDOM from 'react-dom';

import React from 'react';
import App from './components/app';
import './main.scss';
import AppStore from './appstore.js';
import Sheet from './sheet.js';
import Base from './base.js';

const TESTING = true;
console.log('testing mode', TESTING);

// global variables
window['map'] = false;
window['Base'] = Base;
window['basemaps'] = Base.requestConfigFile('basemaps.json', true);
window['overlaymaps'] = Base.processOverlayData();
window['store'] = new AppStore();

// assigning config. If TESTING === true, config will be extended with config_testing.json

window['config'] = Base.requestConfigFile('config.json', true);
store.changeLoadingStatus('config');
if (TESTING) {
  const testConfig = Base.requestConfigFile('config_testing.json', true);
  window['config'] = Object.assign(config, testConfig);
}
store.loadConfig();

// signing

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
);

window['sheetId'] = location.hash.substring(1);

window['initSheet'] = () => {
  store.changeLoadingStatus('signing');
  Sheet.init(() => {
    // Sheet.readLine(1, (vals) => console.log(vals));
    // Sheet.readLine(2, (vals) => console.log(vals));
    // Sheet.updateLine(68, ['test'], (vals) => console.log(vals));
    store.init();
  });
};

if (sheetId) {
  initSheet();
} else {
  store.changeLoadingStatus('prompting table');
}
