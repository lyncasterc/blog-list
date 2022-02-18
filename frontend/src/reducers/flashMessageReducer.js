import { createSlice } from '@reduxjs/toolkit';

const flashMessageSlice = createSlice({
  name: 'flashMessages',
  initialState: {
    type: '',
    message: '',
  },
  reducers: {
    addflashMessage(state, action) {
      const { type, message } = action.payload;
      state.type = type;
      state.message = message;
    },
    // eslint-disable-next-line no-unused-vars
    removeflashMessage(state, action) {
      state.type = '';
      state.message = '';
    },
  },
});

export default flashMessageSlice.reducer;

export const { addflashMessage, removeflashMessage } = flashMessageSlice.actions;

export const setFlashMessage = (flashMessage, seconds) => {
  const milSeconds = seconds * 1000;
  return (dispatch) => {
    dispatch(addflashMessage(flashMessage));
    setTimeout(() => {
      dispatch(removeflashMessage());
    }, milSeconds);
  };
};
