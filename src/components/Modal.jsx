import React from 'react';
import styles from '../styles/Modal.module.css';

const Modal = ({ isOpen, title, children, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button className={styles.closeButton} onClick={onClose}>x</button>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
