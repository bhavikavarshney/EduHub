import React from 'react';
import './Preloader.css';

const Preloader = () => {
  return (
    <div className="preloader">
      <img src="/bookPreloader.gif" alt="Loading..." className="preloader-icon" />
    </div>
  );
};

export default Preloader;
