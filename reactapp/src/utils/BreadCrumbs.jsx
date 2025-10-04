import React from 'react';
import { Link } from 'react-router-dom';
import './BreadCrumbs.css'

const Breadcrumbs = ({ crumbs }) => {
  return (
    <nav className="breadcrumbs">
      {crumbs.map((crumb, index) => (
        <span key={index}>
          {crumb.path ? (
            <Link to={crumb.path}>{crumb.label}</Link>
          ) : (
            <span>{crumb.label}</span>
          )}
          {index < crumbs.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;