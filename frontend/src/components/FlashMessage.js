import React from 'react';
import propTypes from 'prop-types';
import flashStyles from './FlashMessage.module.css';

function FlashMessage({ type, message }) {
  if (message === '') {
    return null;
  }
  return (
    <div className={`${flashStyles.flash} ${flashStyles[type]}`}>
      {message}
    </div>
  );
}

FlashMessage.propTypes = {
  type: propTypes.string,
  message: propTypes.string,
};

FlashMessage.defaultProps = {
  type: '',
  message: '',
};

export default FlashMessage;
