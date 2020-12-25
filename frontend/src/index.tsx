import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { taskMiddleware } from 'react-palm/tasks';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import keplerGlReducer from 'kepler.gl/reducers';
import './index.css';
import App from './App';


const initialState: any = {};
const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const middlewares = [taskMiddleware];

// using createStore
const store = createStore(
    reducers,
    initialState,
    applyMiddleware(...middlewares)
);


ReactDOM.render(
  <Provider store={store}>
      <App />
  </Provider>
  ,
  document.getElementById('root')
);


