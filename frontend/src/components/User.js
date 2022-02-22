import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function User() {
  const { userId } = useParams();
  const filteredUsers = useSelector((state) => state.users.filter((user) => user.id === userId));
  const user = filteredUsers[0];

  return (
    <div className="container">
      <h2>{user.name}</h2>
      <p>
        <strong>
          added blogs
        </strong>
      </p>

      <ul>

        {
            user.blogs.map((blog) => (
              <li key={blog.id} data-cy="user-blog-item">
                { blog.title }
              </li>
            ))
          }

      </ul>
    </div>
  );
}

export default User;
