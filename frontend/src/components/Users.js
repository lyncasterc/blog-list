import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import usersStyles from './Users.module.css';

function Users() {
  const users = useSelector((state) => [...state.users].sort((a, b) => a.name - b.name));

  return (
    <div className="container">
      <h2> Users </h2>

      <div className={usersStyles['users-list']}>
        <h3 className={usersStyles['blogs-created']}> blogs created </h3>

        {
        users.map((user) => (
          <div
            key={user.id}
            className={`${usersStyles['user-item']} flex`}
            data-cy="user-item"
          >
            <Link to={`/users/${user.id}`}>
              {' '}
              { user.name }
              {' '}
            </Link>
            {' '}
            <p>{user.blogs.length}</p>
          </div>
        ))
      }
      </div>

    </div>
  );
}

export default Users;
