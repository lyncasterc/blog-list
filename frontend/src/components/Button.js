import React from 'react';
import propTypes from 'prop-types';

function Button({ buttonText, onClick }) {
  return (
    <button type="submit" onClick={onClick}>
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
