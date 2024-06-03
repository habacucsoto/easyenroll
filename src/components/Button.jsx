import React from 'react';
import styles from '../styles/Button.module.css';

const Button = ({ bg, icon, text, action }) => {
    const bgcolor = {
        backgroundColor: bg,
        borderRadius: '10%'
    };

    return (
        <button onClick={action} className={`${styles.button} ${icon ? styles.iconButton : styles.textButton}`} style={bgcolor}>
            {icon ? (
                <span className="material-symbols-outlined">{icon}</span>
            ) : (
                text
            )}
        </button>
    );
};

export default Button;
