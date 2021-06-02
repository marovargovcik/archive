import React from 'react';
import ReactDOM from 'react-dom';

// Executes axios side effects - setting up global request/response interceptors, loading baseURL
import './utils/setupAxios';

import App from './App';

ReactDOM.render(<App />, document.querySelector('#root'));
