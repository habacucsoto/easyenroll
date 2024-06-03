import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showReadModal, setShowReadModal] = useState(false);

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
                <Button bg="#00BF63" icon="add" action={() => setShowCreateModal(true)} />
            </div>

            {/* Modal para Crear */}
            {createModal && 
                <Modal isOpen={showCreateModal} title="Crear registro" onClose={() => setShowCreateModal(false)}>
                    {createModal}
                </Modal>
            }

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
                                    <Button bg="#F3BA53" icon="visibility" action={() => {
                                        onView(item.id);
                                        setShowReadModal(true);
                                    }} />
                                    <Button bg="#737373" icon="edit" action={() => {
                                        onEdit(item.id);
                                        setShowEditModal(true);
                                    }} />
                                    <Button bg="#FF0000" icon="delete" action={() => {
                                        onDelete(item.id);
                                        setShowDeleteModal(true);
                                    }} />
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

            {/* Modal para Editar */}
            {editModal && 
                <Modal isOpen={showEditModal} title="Editar registro" onClose={() => setShowEditModal(false)}>
                    {editModal}
                </Modal>
            }

            {/* Modal para Eliminar */}
            {deleteModal && 
                <Modal isOpen={showDeleteModal} title="Eliminar registro" onClose={() => setShowDeleteModal(false)}>
                    {deleteModal}
                </Modal>
            }

            {/* Modal para Visualizar */}
            {readModal && 
                <Modal isOpen={showReadModal} title="Ver registro" onClose={() => setShowReadModal(false)}>
                    {readModal}
                </Modal>
            }
        </div>
    );
};

export default CrudView;
