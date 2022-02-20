import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initializeUsers } from '../reducers/userReducer';
import usersStyles from './Users.module.css';

function Users() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

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
            <p>{user.name}</p>
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
