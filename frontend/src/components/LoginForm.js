import React from 'react';
import { useDispatch } from 'react-redux';
import { setFlashMessage } from '../reducers/flashMessageReducer';
import { loginUser } from '../reducers/currentUserReducer';
import hooks from '../hooks/index';

function LoginForm() {
  const username = hooks.useField('text');
  const password = hooks.useField('password');
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(username.attrs.value, password.attrs.value));
    } catch (error) {
      dispatch(setFlashMessage({ type: 'error', message: error.message }, 10));
      username.reset();
      password.reset();
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          {...username.attrs}
          placeholder="Enter Username"
          name="username"
        />
      </div>

      <div>
        password
        <input
          {...password.attrs}
          placeholder="Enter Password"
          name="password"
        />
      </div>

      <button type="submit">Log in</button>
    </form>
  );
}

export default LoginForm;
