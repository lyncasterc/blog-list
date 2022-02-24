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
    <nav className={navbarStyles.navbar} data-cy="navbar">
      <div className={navbarStyles['navbar-left']}>
        <div className={navbarStyles['navbar-item']}>
          <Link to="/"> Blogs </Link>
        </div>

        <div className={navbarStyles['navbar-item']}>
          <Link to="/users"> Users </Link>
        </div>

      </div>

      <div className={navbarStyles['navbar-left']}>
        <div className={navbarStyles['navbar-item']}>
          <p>
            {' '}
            { currentUser.name }
            {' '}
            logged in
            {' '}
          </p>
        </div>

        <div className={`${navbarStyles['navbar-item']}`}>
          <Button
            onClick={() => dispatch(logoutUser())}
            buttonText="Log out"
          />
        </div>
      </div>

    </nav>
  );
}

export default Navbar;
