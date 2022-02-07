import React from 'react';
import propTypes from 'prop-types';
import Input from './Input';
import Button from './Button';

function BlogForm({
  title, author, url, onSubmit, onChangeTitle, onChangeAuthor, onChangeURL,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <Input
          label="Title: "
          onChange={onChangeTitle}
          value={title}
          name="title"
          placeholder="Enter Title"
        />
      </div>

      <div>
        <Input
          label="Author: "
          onChange={onChangeAuthor}
          value={author}
          name="author"
          placeholder="Enter Author"
        />
      </div>

      <div>
        <Input
          label="URL: "
          onChange={onChangeURL}
          value={url}
          name="url"
          placeholder="Enter url"
        />
      </div>

      <Button
        buttonText="Add Note"
      />
    </form>
  );
}

BlogForm.propTypes = {
  title: propTypes.string.isRequired,
  url: propTypes.string.isRequired,
  author: propTypes.string.isRequired,
  onSubmit: propTypes.func.isRequired,
  onChangeAuthor: propTypes.func.isRequired,
  onChangeTitle: propTypes.func.isRequired,
  onChangeURL: propTypes.func.isRequired,
};

export default BlogForm;
