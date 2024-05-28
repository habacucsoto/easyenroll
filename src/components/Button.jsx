import React from 'react';
import styles from '../styles/Button.module.css';

const Button = ({ bg, icon, action }) => {
    const bgcolor = {
        backgroundColor: bg,
        borderRadius: '20%'
    }
    return (
        <button onClick={action} className={styles.button}>
            <span className="material-symbols-outlined" style={bgcolor}>{icon}</span>
        </button>
    );
};

export default Button;
