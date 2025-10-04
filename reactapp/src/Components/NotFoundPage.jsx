import React from 'react';
import './ErrorPage.css';

function NotFoundPage() {
    return (
        <div className="error-container">
            <div className="error-card">
                <h2>404 Not Found!</h2>
                <p>Please try again later.</p>
                <img className="error-img" src='/alert.png' alt='warning-image' />
            </div>
        </div>
    );
}

export default NotFoundPage;