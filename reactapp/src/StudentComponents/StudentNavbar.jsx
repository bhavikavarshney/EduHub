import AppNavbar from '../Components/AppNavbar';
import React from 'react';

const StudentNavbar = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  return <AppNavbar userName={currentUser?.userName} role={currentUser?.role} />;
};

export default StudentNavbar;