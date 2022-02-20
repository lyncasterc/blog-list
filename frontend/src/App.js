import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Routes,
  Route,
} from 'react-router-dom';
import { initalizeBlogs } from './reducers/blogReducer';
import { initalizeCurrentUser } from './reducers/currentUserReducer';
import LoginForm from './components/LoginForm';
import Blogs from './components/Blogs';
import BlogForm from './components/BlogForm';
import FlashMessage from './components/FlashMessage';
import Togglable from './components/Togglable';
import Navbar from './components/Navbar';
import Users from './components/Users';

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    dispatch(initalizeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initalizeCurrentUser());
  }, [dispatch]);

  if (currentUser.token) {
    return (
      <div className="container">
        <FlashMessage />

        <Navbar />
        <Routes>
          <Route path="/" />
          <Route path="/blogs" />
          <Route path="/users" element={<Users />} />
        </Routes>

        <Blogs
          currentUser={currentUser.username}
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

      <LoginForm />

    </div>
  );
}

export default App;
