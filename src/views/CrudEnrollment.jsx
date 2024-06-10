import React, { useState, useEffect } from 'react';
import CrudView from './CrudView';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import SearchableInput from '../components/SearchableInput';
import { useUser } from '../users/UserContext';
import PagoForm from '../modals/PagoForm';
import InscripcionForm from '../modals/InscripcionForm';
import AnexoForm from '../modals/AnexoForm';

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
    query GET_ENROLLMENT_BY_NAME($idAlumno: String!){
        enrollments(idAlumno: $idAlumno) {
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

const CREATE_PAGO = gql`
    mutation createPayment($recibo: String!, $descuento: Int!, $idRecibo: Int!, $monto: Float!, $fechaPago: Date!, $metodoPago: String!) {
        createPayment(recibo: $recibo, descuento: $descuento, idRecibo: $idRecibo, monto: $monto, fechaPago: $fechaPago, metodoPago: $metodoPago) {
            idPago
        }
    }
`;

const CREATE_INSCRIPCION = gql`
    mutation createEnrollment($factura: Boolean!, $tipoInscripcion: String!, $modalidadPago: String!, $idAlumno: Int!, $idPago: Int!, $idUsuario: Int!) {
        createEnrollment(factura: $factura, tipoInscripcion: $tipoInscripcion, modalidadPago: $modalidadPago, idAlumno: $idAlumno, idPago: $idPago, idUsuario: $idUsuario) {
            id
        }
    }
`;

const CREATE_ANEXO_ALUMNOS = gql`
    mutation createAnnex($cartaBuenaConducta: Boolean!, $certificadoPrimaria: Boolean!, $curpAlumno: Boolean!, $actaNacimiento: Boolean!, $observaciones: String!, $cda: String!, $autorizacionIrseSolo: Boolean!, $autorizacionPublicitaria: Boolean!, $atencionPsicologica: Boolean!, $padecimiento: String!, $usoAparatoAuditivo: Boolean!, $usoDeLentes: Boolean!, $lateralidad: String!, $idAlumno: Int!) {
        createAnnex(cartaBuenaConducta: $cartaBuenaConducta, certificadoPrimaria: $certificadoPrimaria, curpAlumno: $curpAlumno, actaNacimiento: $actaNacimiento, observaciones: $observaciones, cda: $cda, autorizacionIrseSolo: $autorizacionIrseSolo, autorizacionPublicitaria: $autorizacionPublicitaria, atencionPsicologica: $atencionPsicologica, padecimiento: $padecimiento, usoAparatoAuditivo: $usoAparatoAuditivo, usoDeLentes: $usoDeLentes, lateralidad: $lateralidad, idAlumno: $idAlumno) {
            id
        }
    }
`;


const CrudEnrollment = ({...props}) => {
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
        
        recibo: '',
        descuento: 0,
        idRecibo: '',
        monto: '',
        fechaPago: '',
        metodoPago: '',
        idAlumno: '',
        modalidadPago: '',
        tipoInscripcion: '',
        factura: false,
        cartaBuenaConducta: false,
        certificadoPrimaria: false,
        curpAlumno: false,
        actaNacimiento: false,
        observaciones: '',
        cda: '',
        autorizacionIrseSolo: false,
        autorizacionPublicitaria: false,
        atencionPsicologica: false,
        padecimiento: '',
        usoAparatoAuditivo: false,
        usoDeLentes: false,
        lateralidad: '',
        idUsuario: '',
    });
    
    const [filteredData, setFilteredData] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);
    const [enrollmentToView, setEnrollmentToView] = useState(null);
    const [enrollmentToEdit, setEnrollmentToEdit] = useState(null);

    const [createPagoMutation] = useMutation(CREATE_PAGO);
    const [createInscripcionMutation] = useMutation(CREATE_INSCRIPCION);
    const [createAnexoAlumnosMutation] = useMutation(CREATE_ANEXO_ALUMNOS);


    const { loading: loadingView, data: dataView, refetch: refetchView } = useQuery(GET_ENROLLMENT_BY_NAME, {
        variables: { nombre: enrollmentToView },
        skip: !enrollmentToView
    });

    useEffect(() => {
        if (data && data.enrollments) {
            setFilteredData(data.enrollments);
        }
    }, [data]);

    const [currentStep, setCurrentStep] = useState(1);
    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAdd = async () => {
        try {
            const { data: pagoData } = await createPagoMutation({
                variables: {
                    recibo: formValues.recibo,
                    descuento: formValues.descuento,
                    idRecibo: formValues.idRecibo,
                    monto: formValues.monto,
                    fechaPago: formValues.fechaPago,
                    metodoPago: formValues.metodoPago,
                }
            });
    
            const pagoId = pagoData.createPayment.idPago;
    
            const { data: anexoData } = await createAnexoAlumnosMutation({
                variables: {
                    cartaBuenaConducta: formValues.cartaBuenaConducta,
                    certificadoPrimaria: formValues.certificadoPrimaria,
                    curpAlumno: formValues.curpAlumno,
                    actaNacimiento: formValues.actaNacimiento,
                    observaciones: formValues.observaciones,
                    cda: formValues.cda,
                    autorizacionIrseSolo: formValues.autorizacionIrseSolo,
                    autorizacionPublicitaria: formValues.autorizacionPublicitaria,
                    atencionPsicologica: formValues.atencionPsicologica,
                    padecimiento: formValues.padecimiento,
                    usoAparatoAuditivo: formValues.usoAparatoAuditivo,
                    usoDeLentes: formValues.usoDeLentes,
                    lateralidad: formValues.lateralidad,
                    idAlumno: formValues.idAlumno,
                }
            });
    
            const { data: inscripcionData } = await createInscripcionMutation({
                variables: {
                    factura: formValues.factura,
                    tipoInscripcion: formValues.tipoInscripcion,
                    modalidadPago: formValues.modalidadPago,
                    idAlumno: formValues.idAlumno,
                    idPago: pagoId,
                    idUsuario: user.id,
                }
            });
    

            setShowCreateModal(false);

        } catch (error) {
            console.error("Error creando la inscripción:", error);
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
        if (!enrollment) {
            console.error('Enrollment not found');
            return;
        }

        setFormValues({
            id: enrollment.id,
            factura: enrollment.factura,
            idAlumno: enrollment.idAlumno.id,
            idPago: enrollment.idPago.idPago,
            idUsuario: enrollment.idUsuario.id,
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
            />

            {/* Modal para Crear */}
            {showCreateModal && 
                <Modal isOpen={showCreateModal} title="Crear Inscripción" onClose={() => setShowCreateModal(false)}>
                {currentStep === 1 && <PagoForm formValues={formValues} handleInputChange={handleInputChange} onNext={nextStep} />}
                {currentStep === 2 && <InscripcionForm formValues={formValues} handleInputChange={handleInputChange} onNext={nextStep} onBack={prevStep} />}
                {currentStep === 3 && <AnexoForm formValues={formValues} handleInputChange={handleInputChange} onSubmit={handleAdd} onBack={prevStep} />}
            </Modal>
            }

            {/* Modal para Eliminar */}
            {showDeleteModal && 
                <Modal isOpen={showDeleteModal} title="Eliminar registro" onClose={() => setShowDeleteModal(false)}>
                    <div>
                        <p>¿Estás seguro que deseas eliminar esta inscripcion?</p>
                        {user.groups.some(group => group.name === 'Directivo') ? (
                            <Button bg="#FF0000" text="Eliminar" action={handleDelete} />
                        ) : (
                            <p>No tienes permisos para eliminar esta inscripcion.</p>
                        )}
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
                                    value={enrollment.idAlumno.id}
                                    isDisabled={true}
                                    id="viewInputAlumnoId"
                                    name="idAlumno"
                                />
                                <Input
                                    placeholder="Pago ID"
                                    value={enrollment.idPago.idPago}
                                    isDisabled={true}
                                    id="viewInputPagoId"
                                    name="idPago"
                                />
                                <Input
                                    placeholder="Usuario ID"
                                    value={enrollment.idUsuario.id}
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
