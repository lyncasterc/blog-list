import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../reducers/currentUserReducer';
import navbarStyles from './Navbar.module.css';
import Button from './Button';

function Navbar() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);

  return (
    <div className={navbarStyles.navbar} data-cy="navbar">
      <Link to="/blogs"> Blogs </Link>
      <Link to="/users"> Users </Link>
      <p>
        {' '}
        { currentUser.name }
        {' '}
        logged in
        {' '}
      </p>
      <Button
        onClick={() => dispatch(logoutUser())}
        buttonText="Log out"
      />
    </div>
  );
}

export default Navbar;
