import React from 'react';
import { useDispatch } from 'react-redux';
import propTypes from 'prop-types';
import { createBlog } from '../reducers/blogReducer';
import { setFlashMessage } from '../reducers/flashMessageReducer';
import Input from './Input';
import hooks from '../hooks/index';
import Button from './Button';

function BlogForm({ toggleVisibility }) {
  const title = hooks.useField('text');
  const author = hooks.useField('text');
  const url = hooks.useField('text');
  const dispatch = useDispatch();

  const addBlog = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createBlog({
        title: title.attrs.value,
        author: author.attrs.value,
        url: title.attrs.value,
      }));
      dispatch(setFlashMessage({ type: 'success', message: 'New blog added!' }, 5));
      toggleVisibility();
    } catch (error) {
      dispatch(setFlashMessage({ type: 'error', message: error.message }, 10));
    } finally {
      title.reset();
      author.reset();
      url.reset();
    }
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        <Input
          label="Title: "
          {...title.attrs}
          name="title"
          placeholder="Enter Title"
        />
      </div>

      <div>
        <Input
          label="Author: "
          {...author.attrs}
          name="author"
          placeholder="Enter Author"
        />
      </div>

      <div>
        <Input
          label="URL: "
          {...url.attrs}
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
