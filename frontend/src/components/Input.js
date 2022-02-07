import React from 'react';
import propTypes from 'prop-types';

function Input({
  label, name, type, value, onChange, placeholder,
}) {
  return (
    <label htmlFor={name}>
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
      />
    </label>
  );
}

Input.propTypes = {
  value: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  label: propTypes.string,
  name: propTypes.string,
  type: propTypes.string,
  placeholder: propTypes.string,
};

Input.defaultProps = {
  label: '',
  name: '',
  type: 'text',
  placeholder: '',
};

export default Input;
