import React from 'react';
import { useDispatch } from 'react-redux';
import propTypes from 'prop-types';
import hooks from '../hooks/index';
import { createComment } from '../reducers/blogReducer';
import { setFlashMessage } from '../reducers/flashMessageReducer';
import Input from './Input';
import Button from './Button';

function CommentForm({ blogId }) {
  const comment = hooks.useField('text');
  const dispatch = useDispatch();

  const addComment = async (e) => {
    e.preventDefault();

    try {
      await dispatch(createComment(blogId, { content: comment.attrs.value }));
      dispatch(setFlashMessage({ type: 'success', message: 'Comment posted!' }, 5));
    } catch (error) {
      console.log(error.message);
      dispatch(setFlashMessage({ type: 'error', message: error.message }, 10));
    } finally {
      comment.reset();
    }
  };

  return (
    <form onSubmit={addComment}>
      <Input
        {...comment.attrs}
        placeholder="Write a comment"
      />
      <Button
        buttonText="add comment"
      />
    </form>
  );
}

CommentForm.propTypes = {
  blogId: propTypes.string.isRequired,
};

export default CommentForm;
