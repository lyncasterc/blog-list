import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './reducers/blogReducer';
import flashMessageReducer from './reducers/flashMessageReducer';
import currentUserReducer from './reducers/currentUserReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    users: userReducer,
    flashMessages: flashMessageReducer,
    currentUser: currentUserReducer,
  },
});

export default store;
