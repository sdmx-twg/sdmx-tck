import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import TestsReducer from '../reducers/TestsReducer';

export const store = createStore(TestsReducer, applyMiddleware(thunk));