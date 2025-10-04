
import React, { useEffect, useState } from 'react';
import './Modal.css'; // Make sure this includes your provided CSS
import Button from './Button';

const MaterialModal = ({ title, description, url, src, onClose }) => {
  const [imageLoading, setImageLoading] = useState(true);
  useEffect(() => {
    setImageLoading(true);
  }, [src]);

  const isImage = src && /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(src);

  return (
    <div className="modal-overlay">
      <div className="modal-d">
        <Button
          btnName={<span style={{ color: '#333', fontSize: '20px' }}>&times;</span>}
          className="modal-close-btn"
          onClick={onClose}
        />
        <h2>Material Detail</h2>
        <p><strong>Title:</strong> {title}</p>
        <p><strong>Description:</strong> {description}</p>
        <p>
          <strong>URL:</strong>{' '}
          <a href={url} target="_blank" rel="noopener noreferrer">View PDF</a>
        </p>
        <div>
          <strong>Attachment:</strong>
          {isImage && (
            <div className="b-img">
              {imageLoading && (
                <div className="image-loader">
                  <img src='/imgLoader.gif' alt="Loading..." className="loader-gif" />
                </div>
              )}
              <img
                src={`${process.env.REACT_APP_BASE_URL}/uploads/${src}`}
                alt="Material Attachment"
                className="material-image"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                style={{ display: imageLoading ? 'none' : 'block' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;