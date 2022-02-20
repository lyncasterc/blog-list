import React from 'react';
import { useSelector } from 'react-redux';
import usersStyles from './Users.module.css';

function Users() {
  const users = useSelector((state) => [...state.users].sort((a, b) => a.name - b.name));

  return (
    <>
      <h2> Users </h2>

      <div>
        <h3 className={usersStyles['blogs-created']}> blogs created </h3>

        {
        users.map((user) => (
          <div key={user.id} className={usersStyles['user-item']}>
            <p>{user.name}</p>
            {' '}
            <p>{user.blogs.length}</p>
          </div>
        ))
      }
      </div>
    </>
  );
}

export default Users;
