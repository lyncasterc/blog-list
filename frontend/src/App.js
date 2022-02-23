import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import { initalizeBlogs } from './reducers/blogReducer';
import { initializeUsers } from './reducers/userReducer';
import { initalizeCurrentUser } from './reducers/currentUserReducer';
import LoginForm from './components/LoginForm';
import Blogs from './components/Blogs';
// import BlogForm from './components/BlogForm';
// import Togglable from './components/Togglable';
import FlashMessage from './components/FlashMessage';
import Navbar from './components/Navbar';
import Users from './components/Users';
import User from './components/User';
import BlogView from './components/BlogView';

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {
    dispatch(initalizeBlogs());
    dispatch(initializeUsers());
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
          <Route
            path="/"
            element={(
              <Blogs
                currentUser={currentUser.username}
              />
            )}
          />

          <Route path="users" element={<Outlet />}>
            <Route index element={<Users />} />
            <Route path=":userId" element={<User />} />
          </Route>

          <Route path="blogs/:blogId" element={<BlogView />} />

        </Routes>

      </div>
    );
  }

  return (
    <div>
      <FlashMessage />
      <LoginForm />
    </div>
  );
}

export default App;
