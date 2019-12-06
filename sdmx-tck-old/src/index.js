import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import testsManagerReducer from './reducers/testsManagerReducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export const store = createStore(testsManagerReducer);
// TEMP: attach the created store to window so it is accessible via chrome developer console.
window.store = store;

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider >, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
