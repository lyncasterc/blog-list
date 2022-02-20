/* eslint-disable arrow-body-style */
import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import loginService from '../services/login';

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {},
  reducers: {
    setCurrentUser(state, action) {
      return action.payload;
    },
    removeCurrentUser() {
      return {};
    },
  },
});

export default currentUserSlice.reducer;

export const { setCurrentUser, removeCurrentUser } = currentUserSlice.actions;

export const initalizeCurrentUser = () => {
  const JSONTokenInfo = localStorage.getItem('bloglistAppUser');
  return (dispatch) => {
    if (JSONTokenInfo) {
      const parsedTokenInfo = JSON.parse(JSONTokenInfo);
      blogService.setToken(parsedTokenInfo.token);
      dispatch(setCurrentUser(parsedTokenInfo));
    }
  };
};

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const tokenInfo = await loginService.login({ username, password });
      if (tokenInfo) {
        localStorage.setItem('bloglistAppUser', JSON.stringify(tokenInfo));
        blogService.setToken(tokenInfo.token);
        dispatch(setCurrentUser(tokenInfo));
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    localStorage.removeItem('bloglistAppUser');
    dispatch(removeCurrentUser());
  };
};
