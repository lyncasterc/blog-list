import { useState } from 'react';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const reset = () => setValue('');

  return {
    attrs: {
      type,
      value,
      onChange,
    },
    reset,
  };
};

const exports = {
  useField,
};

export default exports;
