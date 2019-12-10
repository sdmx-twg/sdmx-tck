import { createStore } from 'redux';

import TestsReducer from '../reducers/TestsReducer';

export const store = createStore(TestsReducer);