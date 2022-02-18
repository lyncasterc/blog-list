import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './reducers/blogReducer';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
  },
});

export default store;
