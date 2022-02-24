import React from 'react';
import propTypes from 'prop-types';
import buttonStyles from './Button.module.css';

function Button({ buttonText, onClick }) {
  return (
    <button type="submit" onClick={onClick} className={buttonStyles.btn}>
      {buttonText}
    </button>
  );
}

Button.propTypes = {
  buttonText: propTypes.string.isRequired,
  onClick: propTypes.func,
};

Button.defaultProps = {
  onClick: () => {},
};

export default Button;
