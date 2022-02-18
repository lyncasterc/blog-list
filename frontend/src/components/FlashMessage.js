import React from 'react';
import { useSelector } from 'react-redux';
import flashStyles from './FlashMessage.module.css';

function FlashMessage() {
  const { type, message } = useSelector((state) => state.flashMessages);

  if (message === '') {
    return null;
  }
  return (
    <div className={`${flashStyles.flash} ${flashStyles[type]}`}>
      {message}
    </div>
  );
}

export default FlashMessage;
