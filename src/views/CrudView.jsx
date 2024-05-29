import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from '../styles/CrudView.module.css';

// Componente CrudView
const CrudView = ({ title, data = [], onQuery, onView, onEdit, onDelete, onAdd }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        onQuery(e.target.value);
    };

    return (
        <div className={styles.crudViewContainer}>
            <h1>{title}</h1>
            <div className={styles.inputContainer}>
                <Input
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    id="searchInput"
                    name="searchInput"
                />
                <Button bg="#00BF63" icon="add" action={() => onAdd(searchTerm)} />
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.nombre ? (item.nombre + ' ' + item.apellidoPaterno + ' ' + item.apellidoMaterno) : item.nombrePadreTutor}</td>
                                <td className={styles.actionButtons}>
                                    <Button bg="#F3BA53" icon="visibility" action={() => onView(item.id)} />
                                    <Button bg="#737373" icon="edit" action={() => onEdit(item.id)} />
                                    <Button bg="#FF0000" icon="delete" action={() => onDelete(item.id)} />
                                </td>
                            </tr>
                        )) 
                    ) : (
                        <tr>
                            <td colSpan="3">No hay datos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CrudView;
