import React, { useState, useEffect } from 'react';
import CrudView from './CrudView';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import SearchableInput from '../components/SearchableInput';
import { useUser } from '../users/UserContext';

const GET_ENROLLMENTS = gql`
    query {
        enrollments {
            id
            factura
            tipoInscripcion
            modalidadPago
            idAlumno {
                id
                nombre
                apellidoPaterno
                apellidoMaterno
            }
            idPago {
                idPago
            }
            idUsuario {
                id
            }
        }
    }
`;

const CREATE_ENROLLMENT = gql`
    mutation CreateEnrollment(
        $factura: Boolean,
        $idAlumno: Int,
        $idPago: Int,
        $idUsuario: Int,
        $modalidadPago: String,
        $tipoInscripcion: String
    ) {
        createEnrollment(
            factura: $factura,
            idAlumno: $idAlumno,
            idPago: $idPago,
            idUsuario: $idUsuario,
            modalidadPago: $modalidadPago,
            tipoInscripcion: $tipoInscripcion
        ) {
            id
            factura
            tipoInscripcion
            modalidadPago
            alumno {
                id
                nombre
                apellidoPaterno
                apellidoMaterno
            }
            pago {
                idPago
            }
            usuario {
                id
            }
        }
    }
`;

const DELETE_ENROLLMENT = gql`
    mutation DeleteEnrollment($id: Int!) {
        deleteEnrollment(id: $id) {
            id
        }
    }
`;

const MODIFY_ENROLLMENT = gql`
    mutation ModifyEnrollment(
        $id: Int!,
        $factura: Boolean,
        $idAlumno: Int,
        $idPago: Int,
        $idUsuario: Int,
        $modalidadPago: String,
        $tipoInscripcion: String
    ) {
        modifyEnrollment(
            id: $id,
            factura: $factura,
            idAlumno: $idAlumno,
            idPago: $idPago,
            idUsuario: $idUsuario,
            modalidadPago: $modalidadPago,
            tipoInscripcion: $tipoInscripcion
        ) {
            id
            factura
            tipoInscripcion
            modalidadPago
            alumno {
                id
                nombre
                apellidoPaterno
                apellidoMaterno
            }
            pago {
                idPago
            }
            usuario {
                id
            }
        }
    }
`;

const GET_ENROLLMENT_BY_NAME = gql`
    query GET_ENROLLMENT_BY_NAME($id: String!){
        enrollments(idUsuario: $id) {
        id
        factura
        tipoInscripcion
        modalidadPago
        idAlumno {
        id
        nombre
        apellidoPaterno
        apellidoMaterno
        escuelaProcedencia
        }
        idPago {
        idPago
        }
        idUsuario {
        id
        }
    }
    }
`;

const CrudEnrollment = () => {
    const { user } = useUser();
    const { loading, error, data, refetch } = useQuery(GET_ENROLLMENTS);
    const [createEnrollment] = useMutation(CREATE_ENROLLMENT, {
        refetchQueries: [{ query: GET_ENROLLMENTS }]
    });
    const [deleteEnrollment] = useMutation(DELETE_ENROLLMENT, {
        refetchQueries: [{ query: GET_ENROLLMENTS }]
    });
    const [modifyEnrollment] = useMutation(MODIFY_ENROLLMENT, {
        refetchQueries: [{ query: GET_ENROLLMENTS }]
    });

    const [formValues, setFormValues] = useState({
        id: null,
        factura: false,
        idAlumno: '',
        idPago: '',
        idUsuario: '',
        modalidadPago: '',
        tipoInscripcion: ''
    });

    const [filteredData, setFilteredData] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);
    const [enrollmentToView, setEnrollmentToView] = useState(null);
    const [enrollmentToEdit, setEnrollmentToEdit] = useState(null);

    const { loading: loadingView, data: dataView, refetch: refetchView } = useQuery(GET_ENROLLMENT_BY_NAME, {
        variables: { nombre: enrollmentToView },
        skip: !enrollmentToView
    });

    useEffect(() => {
        if (data && data.enrollments) {
            setFilteredData(data.enrollments);
        }
    }, [data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleAdd = async () => {
        try {
            await createEnrollment({ variables: formValues });
            setShowCreateModal(false);
            refetch();
        } catch (error) {
            console.error('Error al crear la inscripción:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEnrollment({
                variables: { id: enrollmentToDelete },
            });
            setShowDeleteModal(false);
            refetch();
        } catch (error) {
            console.error('Error al eliminar la inscripción:', error);
        }
    };

    const handleView = async (nombre) => {
        setEnrollmentToView(nombre);
        setShowViewModal(true);
        refetchView();
    };

    const handleEdit = async () => {
        try {
            await modifyEnrollment({ variables: formValues });
            setShowEditModal(false);
            refetch();
        } catch (error) {
            console.error('Error al modificar la inscripción:', error);
        }
    };

    const prepareEdit = (enrollment) => {
        setFormValues({
            id: enrollment.id,
            factura: enrollment.factura,
            idAlumno: enrollment.alumno.id,
            idPago: enrollment.pago.idPago,
            idUsuario: enrollment.usuario.id,
            modalidadPago: enrollment.modalidadPago,
            tipoInscripcion: enrollment.tipoInscripcion
        });
        setEnrollmentToEdit(enrollment.id);
        setShowEditModal(true);
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los datos: {error.message}</p>;

    return (
        <div>
            <CrudView
                title="Gestión de Inscripciones"
                data={filteredData}
                onQuery={(query) => console.log('Consulta con término:', query)}
                onView={handleView}
                onEdit={(id) => {
                    const enrollment = data.enrollments.find((enr) => enr.id === id);
                    prepareEdit(enrollment);
                }}
                onDelete={(id) => {
                    setEnrollmentToDelete(id);
                    setShowDeleteModal(true);
                }}
                onAdd={() => setShowCreateModal(true)}
                createModal={
                    <div>
                        <SearchableInput
                            placeholder="Factura"
                            value={formValues.factura}
                            onChange={handleInputChange}
                            id="createInputFactura"
                            name="factura"
                        />
                        <Input
                            placeholder="Alumno ID"
                            value={formValues.idAlumno}
                            onChange={handleInputChange}
                            id="createInputAlumnoId"
                            name="idAlumno"
                        />
                        <Input
                            placeholder="Pago ID"
                            value={formValues.idPago}
                            onChange={handleInputChange}
                            id="createInputPagoId"
                            name="idPago"
                        />
                        <Input
                            placeholder="Usuario ID"
                            value={formValues.idUsuario}
                            onChange={handleInputChange}
                            id="createInputUsuarioId"
                            name="idUsuario"
                        />
                        <Input
                            placeholder="Modalidad de Pago"
                            value={formValues.modalidadPago}
                            onChange={handleInputChange}
                            id="createInputModalidadPago"
                            name="modalidadPago"
                        />
                        <Input
                            placeholder="Tipo de Inscripción"
                            value={formValues.tipoInscripcion}
                            onChange={handleInputChange}
                            id="createInputTipoInscripcion"
                            name="tipoInscripcion"
                        />
                        <Button bg="#00BF63" text="Crear Inscripción" action={handleAdd} />
                    </div>
                }
            />

            {/* Modal para Crear */}
            {showCreateModal && 
                <Modal isOpen={showCreateModal} title="Crear Inscripción" onClose={() => setShowCreateModal(false)}>
                    <div>
                        <Input
                            placeholder="Factura"
                            value={formValues.factura}
                            onChange={handleInputChange}
                            id="createInputFactura"
                            name="factura"
                        />
                        <Input
                            placeholder="Alumno ID"
                            value={formValues.idAlumno}
                            onChange={handleInputChange}
                            id="createInputAlumnoId"
                            name="idAlumno"
                        />
                        <Input
                            placeholder="Pago ID"
                            value={formValues.idPago}
                            onChange={handleInputChange}
                            id="createInputPagoId"
                            name="idPago"
                        />
                        <Input
                            placeholder="Usuario ID"
                            value={formValues.idUsuario}
                            onChange={handleInputChange}
                            id="createInputUsuarioId"
                            name="idUsuario"
                        />
                        <Input
                            placeholder="Modalidad de Pago"
                            value={formValues.modalidadPago}
                            onChange={handleInputChange}
                            id="createInputModalidadPago"
                            name="modalidadPago"
                        />
                        <Input
                            placeholder="Tipo de Inscripción"
                            value={formValues.tipoInscripcion}
                            onChange={handleInputChange}
                            id="createInputTipoInscripcion"
                            name="tipoInscripcion"
                        />
                        <Button bg="#00BF63" text="Crear Inscripción" action={handleAdd} />
                    </div>
                </Modal>
            }

            {/* Modal para Eliminar */}
            {showDeleteModal && 
                <Modal isOpen={showDeleteModal} title="Eliminar registro" onClose={() => setShowDeleteModal(false)}>
                    <div>
                        <p>¿Estás seguro que deseas eliminar esta inscripción?</p>
                        <Button bg="#FF0000" text="Eliminar" action={handleDelete} />
                    </div>
                </Modal>
            }

            {/* Modal para Ver */}
            {showViewModal && dataView && 
                <Modal isOpen={showViewModal} title="Detalles de la Inscripción" onClose={() => setShowViewModal(false)}>
                    <div>
                        {dataView.enrollments.map((enrollment) => (
                            <div key={enrollment.id}>
                                <Input
                                    placeholder="Factura"
                                    value={enrollment.factura}
                                    isDisabled={true}
                                    id="viewInputFactura"
                                    name="factura"
                                />
                                <Input
                                    placeholder="Alumno ID"
                                    value={enrollment.alumno.id}
                                    isDisabled={true}
                                    id="viewInputAlumnoId"
                                    name="idAlumno"
                                />
                                <Input
                                    placeholder="Pago ID"
                                    value={enrollment.pago.idPago}
                                    isDisabled={true}
                                    id="viewInputPagoId"
                                    name="idPago"
                                />
                                <Input
                                    placeholder="Usuario ID"
                                    value={enrollment.usuario.id}
                                    isDisabled={true}
                                    id="viewInputUsuarioId"
                                    name="idUsuario"
                                />
                                <Input
                                    placeholder="Modalidad de Pago"
                                    value={enrollment.modalidadPago}
                                    isDisabled={true}
                                    id="viewInputModalidadPago"
                                    name="modalidadPago"
                                />
                                <Input
                                    placeholder="Tipo de Inscripción"
                                    value={enrollment.tipoInscripcion}
                                    isDisabled={true}
                                    id="viewInputTipoInscripcion"
                                    name="tipoInscripcion"
                                />
                            </div>
                        ))}
                    </div>
                </Modal>
            }

            {/* Modal para Editar */}
            {showEditModal && 
                <Modal isOpen={showEditModal} title="Editar Inscripción" onClose={() => setShowEditModal(false)}>
                    <div>
                        <Input
                            placeholder="Factura"
                            value={formValues.factura}
                            onChange={handleInputChange}
                            id="editInputFactura"
                            name="factura"
                        />
                        <Input
                            placeholder="Alumno ID"
                            value={formValues.idAlumno}
                            onChange={handleInputChange}
                            id="editInputAlumnoId"
                            name="idAlumno"
                        />
                        <Input
                            placeholder="Pago ID"
                            value={formValues.idPago}
                            onChange={handleInputChange}
                            id="editInputPagoId"
                            name="idPago"
                        />
                        <Input
                            placeholder="Usuario ID"
                            value={formValues.idUsuario}
                            onChange={handleInputChange}
                            id="editInputUsuarioId"
                            name="idUsuario"
                        />
                        <Input
                            placeholder="Modalidad de Pago"
                            value={formValues.modalidadPago}
                            onChange={handleInputChange}
                            id="editInputModalidadPago"
                            name="modalidadPago"
                        />
                        <Input
                            placeholder="Tipo de Inscripción"
                            value={formValues.tipoInscripcion}
                            onChange={handleInputChange}
                            id="editInputTipoInscripcion"
                            name="tipoInscripcion"
                        />
                        <Button bg="#00BF63" text="Guardar cambios" action={handleEdit} />
                    </div>
                </Modal>
            }
        </div>
    );
};

export default CrudEnrollment;
