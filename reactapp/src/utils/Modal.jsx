import React from 'react';
import './Modal.css';
import Button from './Button';

const Modal = ({
  isOpen,
  heading = "Are you sure?",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-d">
        <Button
          btnName={<span>&times;</span>}
          className="modal-close-btn"
          onClick={onCancel}
          title="Close"
        />
        <p>{heading}</p>
        <Button
          btnName={confirmText}
          className="confirm-btn"
          type="button"
          onClick={onConfirm}
        />
        <Button
          btnName={cancelText}
          className="cancel-btn"
          type="button"
          onClick={onCancel}
        />
      </div>
    </div>
  );
};

export default Modal;
