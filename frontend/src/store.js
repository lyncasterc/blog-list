import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './reducers/blogReducer';
import flashMessageReducer from './reducers/flashMessageReducer';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    flashMessages: flashMessageReducer,
  },
});

export default store;
