import './App.css';
import { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import loginService from './services/login';

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

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userTokenInfo, setUserTokenInfo] = useState(null);

  useEffect(() => {
    const JSONTokenInfo = localStorage.getItem('bloglistAppUser');

    if (JSONTokenInfo) {
      setUserTokenInfo(JSON.parse(JSONTokenInfo));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const tokenInfo = await loginService.login({ username, password });
      console.log(tokenInfo);
      if (tokenInfo) {
        localStorage.setItem('bloglistAppUser', JSON.stringify(tokenInfo));
        setUserTokenInfo(tokenInfo);
      }
      setUsername('');
      setPassword('');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      {!userTokenInfo
        ? (
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={({ target }) => setUsername(target.value)}
            setPassword={({ target }) => setPassword(target.value)}
          />
        )
        : (
          <p>
            Hello,
            {' '}
            {userTokenInfo.name}
          </p>
        )}
    </div>
  );
}

export default App;
