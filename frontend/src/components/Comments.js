import React from 'react';
import propTypes from 'prop-types';

function Comments({ comments }) {
  return (
    <ul>
      {
        comments.map((c) => (
          <li key={c.id}>
            {c.content}
          </li>
        ))
      }
    </ul>
  );
}

Comments.propTypes = {
  comments: propTypes.arrayOf(propTypes.object).isRequired,
};

export default Comments;
