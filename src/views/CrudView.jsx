import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import SearchableInput from '../components/SearchableInput';
import Modal from '../components/Modal';
import styles from '../styles/CrudView.module.css';

const CrudView = ({ 
    title, 
    data = [], 
    onQuery, 
    onView, 
    onEdit, 
    onDelete, 
    onAdd,
    createModal, 
    deleteModal, 
    editModal, 
    readModal 
}) => {
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    return (
        <div className={styles.crudViewContainer}>
            <h1>{title}</h1>
            <div className={styles.inputContainer}>
                <SearchableInput
                    placeholder="Buscar por nombre"
                    data={data}
                    onFilteredData={setFilteredData}
                    id="searchInput"
                    name="searchInput"
                />
                <Button bg="#00BF63" icon="add" action={onAdd} />
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
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.nombrePadreTutor || (item.apellidoPaterno ? (item.nombre + ' ' + item.apellidoPaterno + ' ' +  item.apellidoMaterno) : null) || (item.idAlumno.apellidoPaterno ? (item.idAlumno.nombre + ' ' + item.idAlumno.apellidoPaterno + ' ' +  item.idAlumno.apellidoMaterno) : null)}</td>
                                <td className={styles.actionButtons}>
                                    <Button bg="#F3BA53" icon="visibility" action={() => onView(item.nombre)} />
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
