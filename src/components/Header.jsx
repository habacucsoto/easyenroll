import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';

const Header = ({ text, isLoggedIn, onLogout }) => {
    const navigate = useNavigate(); // Obtener el objeto de navegación

    const handleLogoutClick = () => {
        onLogout();
        // Limpiar el almacenamiento de sesión
        sessionStorage.clear();
        // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
        navigate('/login');
        // Refrescar la página
        window.location.reload();
    };

    if (!isLoggedIn) {
        return null; // No renderizar el header si no hay sesión iniciada
    }

    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <img src="https://firebasestorage.googleapis.com/v0/b/yesnoapi-dc638.appspot.com/o/easyenroll%2Fescudo.png?alt=media&token=b1ad9aab-dfa3-4023-a5c2-b64fe89d45c7" alt="Logo" />
            </div>
            <div className={styles.text}>{text}</div>
            <div className={styles.icon}>
                {/* Utiliza el icono de logout dentro del botón */}
                <button className={styles.iconButton} onClick={handleLogoutClick}>
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>
        </div>
    );
};

export default Header;
