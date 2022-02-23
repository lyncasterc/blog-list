import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likeBlog } from '../reducers/blogReducer';
import CommentForm from './CommentForm';
import Comments from './Comments';

// import blogViewStyles from './BlogView.module.css';
import Button from './Button';

function BlogView() {
  const { blogId } = useParams();
  const dispatch = useDispatch();
  const filteredBlogs = useSelector((state) => state.blogs.filter((blog) => blog.id === blogId));
  const blog = filteredBlogs[0];

  if (blog) {
    return (
      <div className="container">
        <h2>{blog.title}</h2>

        <a href={blog.url}>{blog.url}</a>
        <p>
          {blog.likes}
          {' '}
          likes
          {' '}
          <Button
            buttonText="like"
            onClick={() => dispatch(likeBlog(blog))}
          />
        </p>
        Posted by:
        {' '}
        {blog.creator.username}

        <div>
          <h3>Comments</h3>
          <CommentForm blogId={blogId} />
          <Comments comments={blog.comments} />
        </div>
      </div>
    );
  }

  return (null);
}

export default BlogView;
