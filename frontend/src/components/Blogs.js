/* eslint-disable no-alert */
import React from 'react';
import propTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Blog from './Blog';
import BlogForm from './BlogForm';
import Togglable from './Togglable';
import { setFlashMessage } from '../reducers/flashMessageReducer';
import { likeBlog, destroyBlog } from '../reducers/blogReducer';

function Blogs({ currentUser }) {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => [...state.blogs].sort((a, b) => b.likes - a.likes));

  const handleDestroyBlog = (title, id) => {
    if (window.confirm(`Delete blog "${title}"?`)) {
      dispatch(destroyBlog(id));
      dispatch(setFlashMessage({ type: 'success', message: 'Blog deleted!' }, 5));
    }
  };

  return (
    <div className="container">
      {
        blogs.map((blog) => (
          <Blog
            title={blog.title}
            author={blog.author}
            likes={blog.likes}
            url={blog.url}
            blogId={blog.id}
            destroyBlog={() => handleDestroyBlog(blog.title, blog.id)}
            updateLikes={() => dispatch((likeBlog(blog)))}
            creator={blog.creator.username}
            currentUser={currentUser}
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

Blogs.propTypes = {
  currentUser: propTypes.string.isRequired,
};

export default Blogs;
