import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initalizeBlogs } from './reducers/blogReducer';
import { initalizeCurrentUser, logoutUser } from './reducers/currentUserReducer';
import LoginForm from './components/LoginForm';
import Blogs from './components/Blogs';
import Button from './components/Button';
import BlogForm from './components/BlogForm';
import FlashMessage from './components/FlashMessage';
import Togglable from './components/Togglable';

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
      <div>
        <FlashMessage />
        <p>
          Hello,
          {' '}
          {currentUser.name}
          {' '}
          <Button
            buttonText="Log out"
            onClick={() => dispatch(logoutUser())}
          />
        </p>

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
