import './App.css';
import { useState, useEffect } from 'react';
import loginService from './services/login';
import blogService from './services/blogs';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import Button from './components/Button';
import BlogForm from './components/BlogForm';
import FlashMessage from './components/FlashMessage';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');
  const [userTokenInfo, setUserTokenInfo] = useState(null);
  const [flash, setFlash] = useState({
    type: '',
    message: '',
  });

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
      setFlash({ type: 'error', message: error.message });
      setTimeout(() => {
        setFlash({ type: '', message: '' });
      }, 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bloglistAppUser');
    setUserTokenInfo(null);
  };

  const addBlog = async (e) => {
    e.preventDefault();

    const newBlog = {
      title,
      author,
      url,
    };

    try {
      const savedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(savedBlog));

      setFlash({ type: 'success', message: 'New blog added!' });
      setTimeout(() => {
        setFlash({ type: '', message: '' });
      }, 3000);

      setAuthor('');
      setURL('');
      setTitle('');
    } catch (error) {
      console.log(error.message);
    }
  };

  if (userTokenInfo) {
    return (
      <div>
        <FlashMessage
          type={flash.type}
          message={flash.message}
        />
        <h2> Blogs </h2>
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

        {
          blogs.map((blog) => (
            <Blog
              title={blog.title}
              author={blog.author}
              key={blog.id}
            />
          ))
        }

        <h2> Add New Blog </h2>
        <BlogForm
          title={title}
          author={author}
          url={url}
          onSubmit={addBlog}
          onChangeURL={({ target }) => setURL(target.value)}
          onChangeTitle={({ target }) => setTitle(target.value)}
          onChangeAuthor={({ target }) => setAuthor(target.value)}
        />
      </div>
    );
  }

  return (
    <div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
      />
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
