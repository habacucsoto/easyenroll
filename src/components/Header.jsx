import React from 'react';
import styles from '../styles/Header.module.css';

const Header = ({ text }) => {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <img src="https://firebasestorage.googleapis.com/v0/b/yesnoapi-dc638.appspot.com/o/easyenroll%2Fescudo.png?alt=media&token=b1ad9aab-dfa3-4023-a5c2-b64fe89d45c7" alt="Logo" />
            </div>
            <div className={styles.text}>{text}</div>
            <div className={styles.icon}>
                <button className={styles.iconButton}>
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>

        </div>
    );
};

export default Header;