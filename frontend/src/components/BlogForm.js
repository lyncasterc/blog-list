import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import propTypes from 'prop-types';
import { createBlog } from '../reducers/blogReducer';
import Input from './Input';
import Button from './Button';

function BlogForm({ toggleVisibility }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');
  const dispatch = useDispatch();

  const addBlog = (e) => {
    e.preventDefault();
    dispatch(createBlog({
      title,
      author,
      url,
    }));
    toggleVisibility();
    setAuthor('');
    setTitle('');
    setURL('');
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        <Input
          label="Title: "
          onChange={({ target }) => setTitle(target.value)}
          value={title}
          name="title"
          placeholder="Enter Title"
        />
      </div>

      <div>
        <Input
          label="Author: "
          onChange={({ target }) => setAuthor(target.value)}
          value={author}
          name="author"
          placeholder="Enter Author"
        />
      </div>

      <div>
        <Input
          label="URL: "
          onChange={({ target }) => setURL(target.value)}
          value={url}
          name="url"
          placeholder="Enter url"
        />
      </div>

      <Button
        buttonText="Save"
      />
    </form>
  );
}

BlogForm.propTypes = {
  toggleVisibility: propTypes.func.isRequired,
};

export default BlogForm;
