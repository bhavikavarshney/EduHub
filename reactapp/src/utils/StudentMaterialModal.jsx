import React, { useEffect, useState } from 'react';
import './StudentMaterialModal.css';
import Button from '../utils/Button';

const MaterialModal = ({ materials, onNext, onPrev, currentPage, total, onClose, showPagination}) => {

 const [imageLoading,setImageLoading]=useState(true)
useEffect(() => {
  setImageLoading(true);
}, [materials]);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-x" onClick={onClose}>×</button>
        <h3>Course Materials</h3>


        {materials.length === 0 ? (
          <p className='no-materials'>No materials available for this course.</p>
        ) : (
          materials.map((material, index) => (
            <div key={index} className="material-card">
              <h4>{material.title}</h4>
              <p>{material.description}</p>
              <p><strong>Upload Date:</strong> {new Date(material.uploadDate).toLocaleDateString()}</p>
              {material.url && (
                <p><a href={material.url} target="_blank" rel="noopener noreferrer">View Material</a></p>
              )}
              {material.file && (
                <div className="b-img">
                {imageLoading && (
                  <div className="image-loader">
                    <img src='/imgLoader.gif' alt="Loading..." className="loader-gif" />
                  </div>
                )}
                <img
                  src={`${process.env.REACT_APP_BASE_URL}/uploads/${material.file}`}
                  alt="Material Attachment"
                  className="material-image"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              </div>
              )}
            </div>
          ))
        )}

        {showPagination && (
          <div className="pagination-controls">
            <Button
              btnName="Previous"
              className="pagination-btn"
              onClick={onPrev}
              disabled={currentPage === 1}
            />
            <span>{currentPage} / {total}</span>
            <Button
              btnName="Next"
              className="pagination-btn"
              onClick={onNext}
              disabled={currentPage === total}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialModal;