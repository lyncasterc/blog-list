import React from 'react';
import { useDispatch } from 'react-redux';
import { setFlashMessage } from '../reducers/flashMessageReducer';
import { loginUser } from '../reducers/currentUserReducer';
import hooks from '../hooks/index';
import Input from './Input';
import Button from './Button';
import loginFormStyles from './LoginForm.module.css';

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
    <div className={loginFormStyles['form-container']}>
      <form onSubmit={handleLogin} className={loginFormStyles.form}>
        <h2 className={loginFormStyles.title}> Log In </h2>

        <div className={loginFormStyles['form-control']}>
          <Input
            {...username.attrs}
            name="username"
            label="Username"
            required
          />

        </div>

        <div className={loginFormStyles['form-control']}>
          <Input
            {...password.attrs}
            type="password"
            name="password"
            label="Password"
            required
          />
        </div>

        <div className={`${loginFormStyles['form-control']} ${loginFormStyles['form-btn']} `}>
          <Button
            buttonText="Login"
          />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
