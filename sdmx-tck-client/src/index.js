import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './assets/css/index.css';
import './assets/css/App.css';

import App from './App';

import { store } from '../src/store/AppStore';

// TEMP: attach the created store to window so it is accessible via chrome developer console.
window.store = store;

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider >, document.getElementById('root')
);