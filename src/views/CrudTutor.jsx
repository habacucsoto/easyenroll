import React, { useState } from 'react';
import CrudView from './CrudView';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const GET_TUTORS = gql`
    query {
        tutors {
            id
            nombrePadreTutor
            telefono
            curpTutor
            scanIne
            scanComprobanteDomicilio
            emailPadreTutor
            alumno {
                id
            }
        }
    }
`;

const CREATE_TUTOR = gql`
    mutation CreatePadresTutores(
        $alumnoId: Int!,
        $curpTutor: String,
        $emailPadreTutor: String,
        $nombrePadreTutor: String,
        $scanComprobanteDomicilio: String,
        $scanIne: String,
        $telefono: String
    ) {
        createTutor(
            alumnoId: $alumnoId,
            curpTutor: $curpTutor,
            emailPadreTutor: $emailPadreTutor,
            nombrePadreTutor: $nombrePadreTutor,
            scanComprobanteDomicilio: $scanComprobanteDomicilio,
            scanIne: $scanIne,
            telefono: $telefono
        ) {
            alumno {
                id
            }
            curpTutor
            emailPadreTutor
            nombrePadreTutor
            scanComprobanteDomicilio
            scanIne
            telefono
        }
    }
`;

const GET_TUTOR_BY_NAME = gql`
    query GetTutorByName($nombre: String!) {
        tutors(search: $nombre) {
            alumno {
                id
            }
            curpTutor
            emailPadreTutor
            nombrePadreTutor
            scanComprobanteDomicilio
            scanIne
            telefono
        }
    }
`;

const DELETE_TUTOR = gql`
    mutation DeleteTutor($id: Int!) {
        deleteTutor(id: $id) {
            id
        }
    }
`;

const MODIFY_TUTOR = gql`
    mutation ModifyPadresTutores(
        $id: Int!,
        $alumnoId: Int!,
        $curpTutor: String,
        $emailPadreTutor: String,
        $nombrePadreTutor: String,
        $scanComprobanteDomicilio: String,
        $scanIne: String,
        $telefono: String
    ) {
        modifyTutor(
            id: $id,
            alumnoId: $alumnoId,
            curpTutor: $curpTutor,
            emailPadreTutor: $emailPadreTutor,
            nombrePadreTutor: $nombrePadreTutor,
            scanComprobanteDomicilio: $scanComprobanteDomicilio,
            scanIne: $scanIne,
            telefono: $telefono
        ) {
            alumno {
                id
            }
            curpTutor
            emailPadreTutor
            nombrePadreTutor
            scanComprobanteDomicilio
            scanIne
            telefono
        }
    }
`;

const CrudTutor = () => {
    const { loading, error, data, refetch } = useQuery(GET_TUTORS);
    const [createTutor] = useMutation(CREATE_TUTOR, {
        refetchQueries: [{ query: GET_TUTORS }]
    });
    const [deleteTutor] = useMutation(DELETE_TUTOR, {
        refetchQueries: [{ query: GET_TUTORS }]
    });
    const [modifyTutor] = useMutation(MODIFY_TUTOR, {
        refetchQueries: [{ query: GET_TUTORS }]
    });

    const [formValues, setFormValues] = useState({
        id: null,
        nombrePadreTutor: '',
        telefono: '',
        curpTutor: '',
        scanIne: '',
        scanComprobanteDomicilio: '',
        emailPadreTutor: '',
        alumnoId: ''
    });

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [tutorToDelete, setTutorToDelete] = useState(null);
    const [tutorToView, setTutorToView] = useState(null);
    const [tutorToEdit, setTutorToEdit] = useState(null);

    const { loading: loadingView, data: dataView, refetch: refetchView } = useQuery(GET_TUTOR_BY_NAME, {
        variables: { nombre: tutorToView },
        skip: !tutorToView
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleAdd = async () => {
        try {
            await createTutor({ variables: formValues });
            setShowCreateModal(false);
            refetch();
        } catch (error) {
            console.error('Error al crear el tutor:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTutor({
                variables: { id: tutorToDelete },
            });
            setShowDeleteModal(false);
            refetch();
        } catch (error) {
            console.error('Error al eliminar el tutor:', error);
        }
    };

    const handleView = async (nombre) => {
        setTutorToView(nombre);
        setShowViewModal(true);
        refetchView();
    };

    const handleEdit = async () => {
        try {
            await modifyTutor({ variables: formValues });
            setShowEditModal(false);
            refetch();
        } catch (error) {
            console.error('Error al modificar el tutor:', error);
        }
    };

    const prepareEdit = (tutor) => {
        setFormValues({
            id: tutor.id,
            nombrePadreTutor: tutor.nombrePadreTutor,
            telefono: tutor.telefono,
            curpTutor: tutor.curpTutor,
            scanIne: tutor.scanIne,
            scanComprobanteDomicilio: tutor.scanComprobanteDomicilio,
            emailPadreTutor: tutor.emailPadreTutor,
            alumnoId: tutor.alumno.id
        });
        setTutorToEdit(tutor.id);
        setShowEditModal(true);
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los datos: {error.message}</p>;

    return (
        <div>
            <CrudView
                title="Gestión de Tutores"
                data={data.tutors}
                onQuery={(query) => console.log('Consulta con término:', query)}
                onView={handleView}
                onEdit={(id) => {
                    const tutor = data.tutors.find((tut) => tut.id === id);
                    prepareEdit(tutor);
                }}
                onDelete={(id) => {
                    setTutorToDelete(id);
                    setShowDeleteModal(true);
                }}
                onAdd={() => setShowCreateModal(true)} // Este es el botón de creación
                createModal={
                    showCreateModal && ( // Mostrar modal solo si showCreateModal es true
                        <Modal isOpen={showCreateModal} title="Crear Tutor" onClose={() => setShowCreateModal(false)}>
                            <div>
                                <Input
                                    placeholder="Nombre del Padre/Tutor"
                                    value={formValues.nombrePadreTutor}
                                    onChange={handleInputChange}
                                    id="createInputNombrePadreTutor"
                                    name="nombrePadreTutor"
                                />
                                <Input
                                    placeholder="Teléfono"
                                    value={formValues.telefono}
                                    onChange={handleInputChange}
                                    id="createInputTelefono"
                                    name="telefono"
                                />
                                <Input
                                    placeholder="CURP"
                                    value={formValues.curpTutor}
                                    onChange={handleInputChange}
                                    id="createInputCurpTutor"
                                    name="curpTutor"
                                />
                                <Input
                                    placeholder="Scan INE"
                                    value={formValues.scanIne}
                                    onChange={handleInputChange}
                                    id="createInputScanIne"
                                    name="scanIne"
                                />
                                <Input
                                    placeholder="Scan Comprobante de Domicilio"
                                    value={formValues.scanComprobanteDomicilio}
                                    onChange={handleInputChange}
                                    id="createInputScanComprobanteDomicilio"
                                    name="scanComprobanteDomicilio"
                                />
                                <Input
                                    placeholder="Email del Padre/Tutor"
                                    value={formValues.emailPadreTutor}
                                    onChange={handleInputChange}
                                    id="createInputEmailPadreTutor"
                                    name="emailPadreTutor"
                                />
                                <Input
                                    placeholder="ID del Alumno"
                                    value={formValues.alumnoId}
                                    onChange={handleInputChange}
                                    id="createInputAlumnoId"
                                    name="alumnoId"
                                />
                                <Button bg="#007bff" text="Crear Tutor" action={handleAdd} />
                            </div>
                        </Modal>
                    )
                }
            />

            {/* Modal para Eliminar */}
            {showDeleteModal &&
                <Modal isOpen={showDeleteModal} title="Eliminar registro" onClose={() => setShowDeleteModal(false)}>
                    <p>¿Estás seguro de que quieres eliminar este tutor?</p>
                    <Button bg="#FF5C5C" text="Eliminar" action={handleDelete} />
                </Modal>
            }

            {/* Modal para Ver */}
            {showViewModal && dataView &&
                <Modal isOpen={showViewModal} title="Detalles del Tutor" onClose={() => setShowViewModal(false)}>
                <div>
                    {dataView.tutors.map((tutor) => (
                        <div key={tutor.id}>
                            <Input
                                placeholder="Nombre del Padre/Tutor"
                                value={tutor.nombrePadreTutor}
                                isDisabled={true}
                                id="viewInputNombrePadreTutor"
                                name="nombrePadreTutor"
                            />
                            <Input
                                placeholder="Teléfono"
                                value={tutor.telefono}
                                isDisabled={true}
                                id="viewInputTelefono"
                                name="telefono"
                            />
                            <Input
                                placeholder="CURP del Tutor"
                                value={tutor.curpTutor}
                                isDisabled={true}
                                id="viewInputCurpTutor"
                                name="curpTutor"
                            />
                            <Input
                                placeholder="Correo del Padre/Tutor"
                                value={tutor.emailPadreTutor}
                                isDisabled={true}
                                id="viewInputEmailPadreTutor"
                                name="emailPadreTutor"
                            />
                            <Input
                                placeholder="Alumno tutorado"
                                value={tutor.alumno.id}
                                isDisabled={true}
                                id="viewInputAlumnoTutorado"
                                name="emailPadreTutor"
                            />
                            <Input
                                placeholder="INE (Escaneado)"
                                value={tutor.scanIne}
                                isDisabled={true}
                                id="viewInputScanIne"
                                name="scanIne"
                            />
                            <Input
                                placeholder="Comprobante de Domicilio (Escaneado)"
                                value={tutor.scanComprobanteDomicilio}
                                isDisabled={true}
                                id="viewInputScanComprobanteDomicilio"
                                name="scanComprobanteDomicilio"
                            />
                        </div>
                    ))}
                </div>
            </Modal>
            }

            {/* Modal para Crear */}
            {showCreateModal && 
                <Modal isOpen={showCreateModal} title="Crear Tutor" onClose={() => setShowCreateModal(false)}>
                    <div>
                        <Input
                            placeholder="Nombre del Padre/Tutor"
                            value={formValues.nombrePadreTutor}
                            onChange={handleInputChange}
                            id="createInputNombrePadreTutor"
                            name="nombrePadreTutor"
                        />
                        <Input
                            placeholder="Teléfono"
                            value={formValues.telefono}
                            onChange={handleInputChange}
                            id="createInputTelefono"
                            name="telefono"
                        />
                        <Input
                            placeholder="CURP del Tutor"
                            value={formValues.curpTutor}
                            onChange={handleInputChange}
                            id="createInputCurpTutor"
                            name="curpTutor"
                        />
                        <Input
                            placeholder="Escaneo INE"
                            value={formValues.scanIne}
                            onChange={handleInputChange}
                            id="createInputScanIne"
                            name="scanIne"
                        />
                        <Input
                            placeholder="Escaneo Comprobante de Domicilio"
                            value={formValues.scanComprobanteDomicilio}
                            onChange={handleInputChange}
                            id="createInputScanComprobanteDomicilio"
                            name="scanComprobanteDomicilio"
                        />
                        <Input
                            placeholder="Correo Electrónico del Padre/Tutor"
                            value={formValues.emailPadreTutor}
                            onChange={handleInputChange}
                            id="createInputEmailPadreTutor"
                            name="emailPadreTutor"
                        />
                        <Input
                            placeholder="ID del Alumno Asociado"
                            value={formValues.alumnoId}
                            onChange={handleInputChange}
                            id="createInputAlumnoId"
                            name="alumnoId"
                        />
                        <Button bg="#00BF63" text="Crear Tutor" action={handleAdd} />
                    </div>
                </Modal>
            }


            {/* Modal para Editar */}
            {showEditModal &&
                <Modal isOpen={showEditModal} title="Editar registro" onClose={() => setShowEditModal(false)}>
                    <div>
                        <Input
                            placeholder="Nombre del Padre/Tutor"
                            value={formValues.nombrePadreTutor}
                            onChange={handleInputChange}
                            id="editInputNombrePadreTutor"
                            name="nombrePadreTutor"
                        />
                        <Input
                            placeholder="Teléfono"
                            value={formValues.telefono}
                            onChange={handleInputChange}
                            id="editInputTelefono"
                            name="telefono"
                        />
                        <Input
                            placeholder="CURP"
                            value={formValues.curpTutor}
                            onChange={handleInputChange}
                            id="editInputCurpTutor"
                            name="curpTutor"
                        />
                        <Input
                            placeholder="Scan INE"
                            value={formValues.scanIne}
                            onChange={handleInputChange}
                            id="editInputScanIne"
                            name="scanIne"
                        />
                        <Input
                            placeholder="Scan Comprobante de Domicilio"
                            value={formValues.scanComprobanteDomicilio}
                            onChange={handleInputChange}
                            id="editInputScanComprobanteDomicilio"
                            name="scanComprobanteDomicilio"
                        />
                        <Input
                            placeholder="Email del Padre/Tutor"
                            value={formValues.emailPadreTutor}
                            onChange={handleInputChange}
                            id="editInputEmailPadreTutor"
                            name="emailPadreTutor"
                        />
                        <Input
                            placeholder="ID del Alumno"
                            value={formValues.alumnoId}
                            onChange={handleInputChange}
                            id="editInputAlumnoId"
                            name="alumnoId"
                        />
                        <Button bg="#007bff" text="Modificar Tutor" action={handleEdit} />
                    </div>
                </Modal>
            }
        </div>
    );
};

export default CrudTutor;
