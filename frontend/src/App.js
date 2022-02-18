/* eslint-disable no-alert */
import './App.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import loginService from './services/login';
import blogService from './services/blogs';
import { initalizeBlogs } from './reducers/blogReducer';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import Button from './components/Button';
import BlogForm from './components/BlogForm';
import FlashMessage from './components/FlashMessage';
import Togglable from './components/Togglable';

function App() {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
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
      // setFlash({ type: 'error', message: error.message });
      // setTimeout(() => {
      //   setFlash({ type: '', message: '' });
      // }, 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bloglistAppUser');
    setUserTokenInfo(null);
  };

  // const addBlog = async (newBlog) => {
  //   try {
  //     const savedBlog = await blogService.create(newBlog);
  //     blogFormVisibilityRef.current.toggleVisibility();
  //     setBlogs(blogs.concat(savedBlog));
  //     setFlash({ type: 'success', message: 'New blog added!' });
  //     setTimeout(() => {
  //       setFlash({ type: '', message: '' });
  //     }, 3000);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // const updateLikes = async (targetBlog) => {
  //   try {
  //     const updatedBlog = await blogService.update(targetBlog);
  //     setBlogs(blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const destroyBlog = async (title, id) => {
  //   if (window.confirm(`Delete blog "${title}"?`)) {
  //     try {
  //       await blogService.destroy(id);
  //       setBlogs(blogs.filter((blog) => blog.id !== id));
  //       setFlash({ type: 'success', message: 'Blog deleted!' });
  //       setTimeout(() => {
  //         setFlash({ type: '', message: '' });
  //       }, 3000);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  if (userTokenInfo) {
    return (
      <div>
        <FlashMessage />
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
          sortedBlogs.map((blog) => (
            <Blog
              title={blog.title}
              author={blog.author}
              likes={blog.likes}
              url={blog.url}
              id={blog.id}
              // destroyBlog={destroyBlog}
              // updateLikes={updateLikes}
              creator={blog.creator.username}
              currentUser={userTokenInfo.username}
              key={blog.id}
            />
          ))
        }

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
