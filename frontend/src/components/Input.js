import React from 'react';
import propTypes from 'prop-types';
import inputStyles from './Input.module.css';

function Input({
  label, name, type, value, onChange, placeholder, required,
}) {
  return (
    <>
      <label htmlFor={name} className={inputStyles.label}>
        {label}
        {' '}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        id={name}
        className={inputStyles.input}
        required={required}
      />
    </>
  );
}

Input.propTypes = {
  value: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  label: propTypes.string,
  name: propTypes.string,
  type: propTypes.string,
  placeholder: propTypes.string,
  required: propTypes.bool,
};

Input.defaultProps = {
  label: '',
  name: '',
  type: 'text',
  placeholder: '',
  required: false,
};

export default Input;
