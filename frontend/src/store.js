import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './reducers/blogReducer';
import flashMessageReducer from './reducers/flashMessageReducer';
import currentUserReducer from './reducers/currentUserReducer';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    flashMessages: flashMessageReducer,
    currentUser: currentUserReducer,
  },
});

export default store;
