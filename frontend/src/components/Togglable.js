import React, { useState, useImperativeHandle } from 'react';
import propTypes from 'prop-types';

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }));

  return (
    <div>
      <button type="submit" onClick={toggleVisibility} style={hideWhenVisible}>
        {' '}
        {props.buttonLabel}
        {' '}
      </button>

      <div style={showWhenVisible}>
        {props.children}
        <button type="submit" onClick={toggleVisibility}> Cancel </button>
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: propTypes.string.isRequired,
  children: propTypes.element.isRequired,
};

export default Togglable;
