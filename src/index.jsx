// index.jsx

// ReactDOM.render(<App />, document.getElementById("container"));

// hi
import React from 'react';
import ReactDOM from 'react-dom' // react 17
import { createRoot } from 'react-dom/client'; // react 18

const { useState, useEffect, useMemo, useReducer } = React;
import userHyperState from '../lib/usehyperstate';

console.log('hi', React, ReactDOM);

const App = (props) => <div>hi react</div>

// react ≤17 way:
// ReactDOM.render(<App />, appNode)  // old and busted

// react ≥18 way:
const root = createRoot(appNode);
root.render(<App />);