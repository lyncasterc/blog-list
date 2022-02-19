/* eslint-disable no-alert */
import './App.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import loginService from './services/login';
import blogService from './services/blogs';
import { initalizeBlogs } from './reducers/blogReducer';
import { setFlashMessage } from './reducers/flashMessageReducer';
import LoginForm from './components/LoginForm';
import Blogs from './components/Blogs';
import Button from './components/Button';
import BlogForm from './components/BlogForm';
import FlashMessage from './components/FlashMessage';
import Togglable from './components/Togglable';

function App() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userTokenInfo, setUserTokenInfo] = useState(null);

  useEffect(() => {
    dispatch(initalizeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const JSONTokenInfo = localStorage.getItem('bloglistAppUser');
    if (JSONTokenInfo) {
      const parsedTokenInfo = JSON.parse(JSONTokenInfo);
      blogService.setToken(parsedTokenInfo.token);
      setUserTokenInfo(parsedTokenInfo);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const tokenInfo = await loginService.login({ username, password });
      if (tokenInfo) {
        localStorage.setItem('bloglistAppUser', JSON.stringify(tokenInfo));
        blogService.setToken(tokenInfo.token);
        setUserTokenInfo(tokenInfo);
      }

      setUsername('');
      setPassword('');
    } catch (error) {
      dispatch(setFlashMessage({ type: 'error', message: error.message }, 5));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bloglistAppUser');
    setUserTokenInfo(null);
  };

  if (userTokenInfo) {
    return (
      <div>
        <FlashMessage />
        <p>
          Hello,
          {' '}
          {userTokenInfo.name}
          {' '}
          <Button
            buttonText="Log out"
            onClick={handleLogout}
          />
        </p>

        <Blogs
          currentUser={userTokenInfo.username}
        />

        <h2> Add New Blog </h2>

        <Togglable buttonLabel="Add blog">
          <BlogForm toggleVisibility={() => {}} />
        </Togglable>

      </div>
    );
  }

  return (
    <div>
      <FlashMessage />
      <h2> Log In </h2>

      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={({ target }) => setUsername(target.value)}
        setPassword={({ target }) => setPassword(target.value)}
      />

    </div>
  );
}

export default App;
