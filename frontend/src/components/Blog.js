import React from 'react';
import propTypes from 'prop-types';

function Blog({ title, author }) {
  return (
    <li>
      <strong>Title:</strong>
      {' '}
      {title}
      <br />
      <strong>Author:</strong>
      {' '}
      {author}
    </li>
  );
}

Blog.propTypes = {
  title: propTypes.string.isRequired,
  author: propTypes.string.isRequired,
};

export default Blog;
