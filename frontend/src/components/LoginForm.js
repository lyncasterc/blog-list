import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFlashMessage } from '../reducers/flashMessageReducer';
import { loginUser } from '../reducers/currentUserReducer';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(username, password));
    } catch (error) {
      dispatch(setFlashMessage({ type: 'error', message: error.message }, 10));
      setUsername('');
      setPassword('');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          placeholder="Enter Username"
          name="username"
        />
      </div>

      <div>
        password
        <input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          placeholder="Enter Password"
          name="password"
        />
      </div>

      <button type="submit">Log in</button>
    </form>
  );
}

export default LoginForm;
