import React from 'react';
import './InputField.css';

const InputField = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  className = '',
  label,
  showLabel = false,
  width = '100%',
}) => {
  return (
    <div style={{ width }}>
      <label className="input-label" style={{width:"100%"}}>
        {label} {required && <span>*</span>}

        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
        />
        {showLabel && label && (
          <span className="label-text">
          </span>
        )}
      </label>
      {error && <small className="error">{error}</small>}
    </div>
  );
};

export default InputField;
