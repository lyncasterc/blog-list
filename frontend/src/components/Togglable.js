import React, { useState } from 'react';
import propTypes from 'prop-types';

function Togglable({ buttonLabel, children }) {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <button type="submit" onClick={toggleVisibility} style={hideWhenVisible}>
        {' '}
        {buttonLabel}
        {' '}
      </button>

      <div style={showWhenVisible}>
        { React.cloneElement(children, { toggleVisibility }) }
        <button type="submit" onClick={toggleVisibility}> Cancel </button>
      </div>
    </div>
  );
}

Togglable.propTypes = {
  buttonLabel: propTypes.string.isRequired,
  children: propTypes.element.isRequired,
};

export default Togglable;
