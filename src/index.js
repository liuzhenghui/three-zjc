import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import './home.css'

import App from './App'

window.React = React;
window.ReactDOM = ReactDOM;

ReactDOM.render(<App/>, document.getElementById('root'))