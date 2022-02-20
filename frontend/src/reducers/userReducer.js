/* eslint-disable arrow-body-style */
import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/users';

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export default userSlice.reducer;

export const { setUsers } = userSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll();
      dispatch(setUsers(users));
    } catch (error) {
      console.error(error);
    }
  };
};
