
import React from 'react';

const DatePicker = ({ label, name, value, onChange, minDate, clearOnClick }) => {
  const handleClick = (e) => {
    if (clearOnClick) {
      clearOnClick();
    }
    e.target.showPicker?.();
  };

  return (
    <div className="date-picker">
      <label>{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        min={minDate}
        onClick={handleClick}
      />
    </div>
  );
};

export default DatePicker;

