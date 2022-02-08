import React, { useState } from 'react';
import propTypes from 'prop-types';
import Button from './Button';
import blogStyles from './Blog.module.css';

function Blog({
  title, author, likes, url, creator, updateLikes, id,
}) {
  const [hide, setHide] = useState(true);
  const toggleHide = () => {
    setHide(!hide);
  };
  const blogLikes = () => (
    <div>
      likes:
      {' '}
      { likes }
      {' '}
      <Button
        buttonText="like"
        onClick={() => {
          updateLikes({
            title,
            author,
            url,
            id,
            likes: likes + 1,
          });
        }}
      />
    </div>
  );
  const blogURL = () => (
    <div>
      URL:
      {' '}
      { url }
    </div>
  );
  const blogCreator = () => (
    <div>
      Posted by:
      {' '}
      { creator }
    </div>
  );

  return (
    <li className={blogStyles.blogItem}>
      {title}
      {' '}
      by
      {' '}
      {author}
      { !hide && blogLikes() }
      { !hide && blogURL() }
      { !hide && blogCreator() }
      {' '}
      <Button
        buttonText={hide ? 'show' : 'hide'}
        onClick={toggleHide}
      />
    </li>
  );
}

Blog.propTypes = {
  title: propTypes.string.isRequired,
  author: propTypes.string.isRequired,
  likes: propTypes.number.isRequired,
  url: propTypes.string.isRequired,
  creator: propTypes.string.isRequired,
  updateLikes: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default Blog;
