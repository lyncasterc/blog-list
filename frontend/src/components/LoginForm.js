import React from 'react';
import { useDispatch } from 'react-redux';
import { setFlashMessage } from '../reducers/flashMessageReducer';
import { loginUser } from '../reducers/currentUserReducer';
import hooks from '../hooks/index';
import Input from './Input';

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
    <form onSubmit={handleLogin} className="container">
      <h2> Log In </h2>
      <div>
        <Input
          {...username.attrs}
          placeholder="Enter Username"
          name="username"
          label="Username"
        />
      </div>

      <div>
        <Input
          {...password.attrs}
          type="password"
          placeholder="Enter Password"
          name="password"
          label="Password"
        />
      </div>

      <button type="submit">Log in</button>
    </form>
  );
}

export default LoginForm;
