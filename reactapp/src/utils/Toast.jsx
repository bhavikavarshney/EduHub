import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { TOAST_VARIANTS } from '../constants';

const ToastMessage = ({ show, onClose, message, variant = 'success' }) => {
    const getTitle = () => {
        switch (variant) {
            case TOAST_VARIANTS.SUCCESS:
                return 'Success';
            case TOAST_VARIANTS.DANGER:
                return 'Error';
            case 'warning':
                return TOAST_VARIANTS.WARNING;
            default:
                return 'Notification';
        }
    };
    return (
        <ToastContainer position="top-end" className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999}}>
            <Toast bg={variant} onClose={onClose} show={show} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{getTitle()}</strong>
                </Toast.Header>
                <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastMessage;