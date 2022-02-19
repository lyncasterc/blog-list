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
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      const { id } = updatedBlog;
      return state.map((blog) => (blog.id === id ? updatedBlog : blog));
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export default blogSlice.reducer;

export const {
  appendBlog, setBlogs, updateBlog, removeBlog,
} = blogSlice.actions;

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

export const likeBlog = (blog) => {
  const likedBlog = {
    ...blog,
    likes: blog.likes + 1,
  };
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update(likedBlog);
      dispatch(updateBlog(updatedBlog));
    } catch (error) {
      console.error(error);
    }
  };
};

export const destroyBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.destroy(id);
      dispatch(removeBlog(id));
    } catch (error) {
      console.error(error);
    }
  };
};
