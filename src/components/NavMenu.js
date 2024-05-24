// NavMenu.js
import React from 'react';
import styles from '../styles/NavMenu.module.css';

const NavMenu = ({ items }) => {
    return (
        <div className={styles.menu}>
            {items.map((item, index) => (
                <MenuItem key={index} class_icon={item.class_icon} icon={item.icon} text={item.text} link={item.link} />
            ))}
        </div>
    );
};

const MenuItem = ({ icon, text, link }) => {
    return (
        <a href={link} className={styles.menuitem}>
            <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
            <div className={styles.text}>{text}</div>
        </a>
    );
};

export default NavMenu;
