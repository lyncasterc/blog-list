import './App.css';
import { useState, useEffect } from 'react';
import loginService from './services/login';
import blogService from './services/blogs';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userTokenInfo, setUserTokenInfo] = useState(null);

  useEffect(async () => {
    try {
      const initialBlogs = await blogService.getAll();
      setBlogs(initialBlogs);
    } catch (error) {
      console.log(error);
    }
  }, []);

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

  if (userTokenInfo) {
    return (
      <div>
        <p>
          Hello,
          {' '}
          {userTokenInfo.name}
        </p>

        <h2> Blogs </h2>

        {
          blogs.map((blog) => (
            <Blog
              title={blog.title}
              author={blog.author}
              key={blog.id}
            />
          ))
        }
      </div>
    );
  }

  return (
    <LoginForm
      handleLogin={handleLogin}
      username={username}
      password={password}
      setUsername={({ target }) => setUsername(target.value)}
      setPassword={({ target }) => setPassword(target.value)}
    />
  );
}

export default App;
