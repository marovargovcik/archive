import './styles.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.component';
import init from './redux/init';
import store from './redux/store';

const { dispatch } = store;

//@TODO: Add default loading state in public/index.html
dispatch(init()).then(function () {
  ReactDOM.render(<App />, document.getElementById('root'));
});
