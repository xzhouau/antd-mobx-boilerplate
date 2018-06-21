import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import getRouter from 'router';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import * as stores from 'stores';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import 'assets/favicon.ico';

function renderWithHotReload(RootElement) {
  ReactDom.render(
    <AppContainer>
      <Provider { ...stores }>
        <Router>{RootElement}</Router>
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  );
}

OfflinePluginRuntime.install({
  onUpdateReady: () => {
    OfflinePluginRuntime.applyUpdate();
  },
  onUpdated: () => {
    window.location.reload();
  }
});

renderWithHotReload(getRouter());

if (module.hot) {
  module.hot.accept('router', () => {
    renderWithHotReload(getRouter());
  });
}
