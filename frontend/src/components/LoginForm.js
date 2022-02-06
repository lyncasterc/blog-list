import React from 'react';
import propTypes from 'prop-types';

function LoginForm({
  handleLogin, username, password, setUsername, setPassword,
}) {
  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          value={username}
          onChange={setUsername}
          placeholder="Enter Username"
          name="username"
        />
      </div>

      <div>
        password
        <input
          value={password}
          onChange={setPassword}
          placeholder="Enter Password"
          name="password"
        />
      </div>

      <button type="submit">Log in</button>
    </form>
  );
}

LoginForm.propTypes = {
  username: propTypes.string.isRequired,
  password: propTypes.string.isRequired,
  setUsername: propTypes.func.isRequired,
  setPassword: propTypes.func.isRequired,
  handleLogin: propTypes.func.isRequired,
};

export default LoginForm;
