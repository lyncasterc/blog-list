/* eslint-disable arrow-body-style */
import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export default blogSlice.reducer;

export const { appendBlog, setBlogs } = blogSlice.actions;

export const createBlog = (blog) => {
  return async (dispatch) => {
    const savedBlog = await blogService.create(blog);
    dispatch(appendBlog(savedBlog));
  };
};

export const initalizeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll();
      dispatch(setBlogs(blogs));
    } catch (error) {
      console.error(error);
    }
  };
};
