import React, { useState, useEffect } from 'react';
import CrudView from './CrudView';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useUser } from '../users/UserContext';

const GET_STUDENTS = gql`
    query {
        students {
            id
            nombre
            apellidoPaterno
            apellidoMaterno
            correoInstitucional
            curp
            escuelaProcedencia
            gradoGrupoAsignado
            sexo
        }
    }
`;

const CREATE_STUDENT = gql`
    mutation CreateStudent(
        $nombre: String!,
        $apellidoPaterno: String!,
        $apellidoMaterno: String!,
        $correoInstitucional: String!,
        $curp: String!,
        $escuelaProcedencia: String!,
        $gradoGrupoAsignado: String!,
        $sexo: String!
    ) {
        createStudent(
            nombre: $nombre,
            apellidoPaterno: $apellidoPaterno,
            apellidoMaterno: $apellidoMaterno,
            correoInstitucional: $correoInstitucional,
            curp: $curp,
            escuelaProcedencia: $escuelaProcedencia,
            gradoGrupoAsignado: $gradoGrupoAsignado,
            sexo: $sexo
        ) {
            id
            nombre
            apellidoPaterno
            apellidoMaterno
            correoInstitucional
            curp
            escuelaProcedencia
            gradoGrupoAsignado
            sexo
        }
    }
`;

const GET_STUDENT_BY_NAME = gql`
    query GetStudentByName($nombre: String!) {
        students(search: $nombre) {
            id
            nombre
            apellidoPaterno
            apellidoMaterno
            correoInstitucional
            curp
            escuelaProcedencia
            gradoGrupoAsignado
            sexo
        }
    }
`;

const DELETE_STUDENT = gql`
    mutation DeleteStudent($id: Int!) {
        deleteStudent(id: $id) {
            id
        }
    }
`;

const MODIFY_STUDENT = gql`
    mutation ModifyStudent(
        $id: Int!,
        $nombre: String!,
        $apellidoPaterno: String!,
        $apellidoMaterno: String!,
        $correoInstitucional: String!,
        $curp: String!,
        $escuelaProcedencia: String!,
        $gradoGrupoAsignado: String!,
        $sexo: String!
    ) {
        modifyStudent(
            id: $id,
            nombre: $nombre,
            apellidoPaterno: $apellidoPaterno,
            apellidoMaterno: $apellidoMaterno,
            correoInstitucional: $correoInstitucional,
            curp: $curp,
            escuelaProcedencia: $escuelaProcedencia,
            gradoGrupoAsignado: $gradoGrupoAsignado,
            sexo: $sexo
        ) {
            id
            nombre
            apellidoPaterno
            apellidoMaterno
            correoInstitucional
            curp
            escuelaProcedencia
            gradoGrupoAsignado
            sexo
        }
    }
`;

const CrudAlumno = () => {
    const { user } = useUser();
    const { loading, error, data, refetch } = useQuery(GET_STUDENTS);
    const [createStudent] = useMutation(CREATE_STUDENT, {
        refetchQueries: [{ query: GET_STUDENTS }]
    });
    const [deleteStudent] = useMutation(DELETE_STUDENT, {
        refetchQueries: [{ query: GET_STUDENTS }]
    });
    const [modifyStudent] = useMutation(MODIFY_STUDENT, {
        refetchQueries: [{ query: GET_STUDENTS }]
    });

    const [formValues, setFormValues] = useState({
        id: null,
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correoInstitucional: '',
        curp: '',
        escuelaProcedencia: '',
        gradoGrupoAsignado: '1A',
        sexo: 'M'
    });

    const [formErrors, setFormErrors] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correoInstitucional: '',
        curp: '',
        escuelaProcedencia: '',
        grado: '',
        grupo: '',
        gradoGrupoAsignado: '',
        sexo: ''
    });
    
    const [filteredData, setFilteredData] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [studentToView, setStudentToView] = useState(null);
    const [studentToEdit, setStudentToEdit] = useState(null);

    const { loading: loadingView, data: dataView, refetch: refetchView } = useQuery(GET_STUDENT_BY_NAME, {
        variables: { nombre: studentToView },
        skip: !studentToView
    });

    useEffect(() => {
        if (data && data.students) {
            setFilteredData(data.students);
        }
    }, [data]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateCurp = (curp) => {
        const regexCurp = /^[A-Z0-9]{18}$/;
        return regexCurp.test(curp);
    };

    const validateText = (value) => {
        const regexNombre = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/u;
        return regexNombre.test(value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });

        switch (name) {
            case 'correoInstitucional':
                setFormErrors({
                    ...formErrors,
                    correoInstitucional: validateEmail(value) ? '' : 'Correo inválido'
                });
                break;
            case 'curp':
                setFormErrors({
                    ...formErrors,
                    curp: validateCurp(value) ? '' : 'CURP inválido'
                });
                break;
            case 'nombre':
                setFormErrors({
                    ...formErrors,
                    nombre: validateText(value) ? '' : 'El texto debe contener solo letras y espacios'
                });
                break;
            case 'apellidoPaterno':
                setFormErrors({
                    ...formErrors,
                    apellidoPaterno: validateText(value) ? '' : 'El texto debe contener solo letras y espacios'
                });
                break;
            case 'apellidoMaterno':
                setFormErrors({
                    ...formErrors,
                    apellidoMaterno: validateText(value) ? '' : 'El texto debe contener solo letras y espacios'
                });
                break;
            default:
                break;
        }
    };

    const openCreateModal = () => {
        setFormValues({
            id: null,
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            correoInstitucional: '',
            curp: '',
            escuelaProcedencia: '',
            gradoGrupoAsignado: '1A',
            sexo: 'M'
        });
        setShowCreateModal(true);
    };    

    const handleAdd = async () => {
        const hasErrors = Object.values(formErrors).some(error => error !== '');
        if (hasErrors) {
            console.error('Error en los campos del formulario');
            return;
        }
        
        try {
            await createStudent({ variables: { ...formValues, gradoGrupoAsignado: `${(formValues.grado + formValues.grupo) || formValues.gradoGrupoAsignado}` } });
            setShowCreateModal(false);
            refetch();
        } catch (error) {
            console.error('Error al crear el alumno:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteStudent({
                variables: { id: studentToDelete },
            });
            setShowDeleteModal(false);
            refetch();
        } catch (error) {
            console.error('Error al eliminar el alumno:', error);
        }
    };

    const handleView = async (nombre) => {
        setStudentToView(nombre);
        setShowViewModal(true);
    };

    const handleEdit = async () => {
        const hasErrors = Object.values(formErrors).some(error => error !== '');
        if (hasErrors) {
            console.error('Error en los campos del formulario');
            return;
        }

        try {
            await modifyStudent({ variables: { ...formValues, gradoGrupoAsignado: `${(formValues.grado + formValues.grupo) || formValues.gradoGrupoAsignado}` } });
            setShowEditModal(false);
            refetch();
        } catch (error) {
            console.error('Error al modificar el alumno:', error);
        }
    };

    const prepareEdit = (student) => {
        const [grado, grupo] = student.gradoGrupoAsignado.split('');
        setFormValues({
            id: student.id,
            nombre: student.nombre,
            apellidoPaterno: student.apellidoPaterno,
            apellidoMaterno: student.apellidoMaterno,
            correoInstitucional: student.correoInstitucional,
            curp: student.curp,
            escuelaProcedencia: student.escuelaProcedencia,
            grado: grado,
            grupo: grupo,
            gradoGrupoAsignado: student.gradoGrupoAsignado,
            sexo: student.sexo
        });
        setStudentToEdit(student.id);
        setShowEditModal(true);
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los datos: {error.message}</p>;

    return (
        <div>
            <CrudView
                title="Gestión de Alumnos"
                data={filteredData}
                onQuery={(query) => console.log('Consulta con término:', query)}
                onView={handleView}
                onEdit={(id) => {
                    const student = data.students.find((stu) => stu.id === id);
                    prepareEdit(student);
                }}
                onDelete={(id) => {
                    setStudentToDelete(id);
                    setShowDeleteModal(true);
                }}
                onAdd={openCreateModal}
                createModal={
                    <div>
                        <Input
                            placeholder="Nombre"
                            value={formValues.nombre}
                            onChange={handleInputChange}
                            id="createInputNombre"
                            name="nombre"
                            error={formErrors.nombre}
                        />
                        <Input
                            placeholder="Apellido Paterno"
                            value={formValues.apellidoPaterno}
                            onChange={handleInputChange}
                            id="createInputApellidoPaterno"
                            name="apellidoPaterno"
                            error={formErrors.apellidoPaterno}
                        />
                        <Input
                            placeholder="Apellido Materno"
                            value={formValues.apellidoMaterno}
                            onChange={handleInputChange}
                            id="createInputApellidoMaterno"
                            name="apellidoMaterno"
                            error={formErrors.apellidoMaterno}
                        />
                        <Input
                            placeholder="Correo Institucional"
                            value={formValues.correoInstitucional}
                            onChange={handleInputChange}
                            id="createInputCorreoInstitucional"
                            name="correoInstitucional"
                            error={formErrors.correoInstitucional}
                        />
                        <Input
                            placeholder="CURP"
                            value={formValues.curp}
                            onChange={handleInputChange}
                            id="createInputCurp"
                            name="curp"
                            error={formErrors.curp}
                        />
                        <Input
                            placeholder="Escuela de Procedencia"
                            value={formValues.escuelaProcedencia}
                            onChange={handleInputChange}
                            id="createInputEscuelaProcedencia"
                            name="escuelaProcedencia"
                        />
                        <div className="grado-grupo">
                            <select
                                name="grado"
                                value={formValues.grado}
                                onChange={handleInputChange}
                                defaultValue={"1"}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                            <select
                                name="grupo"
                                value={formValues.grupo}
                                onChange={handleInputChange}
                                defaultValue={"A"}
                            >
                                <option value="A">A</option>
                                <option value="B">B</option>
                            </select>
                        </div>
                        <select
                            name="sexo"
                            value={formValues.sexo}
                            onChange={handleInputChange}
                            defaultValue={"M"}
                        >
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                        <Button bg="#00BF63" text="Crear Alumno" action={handleAdd} />
                    </div>
                }
            />

            {/* Modal para Eliminar */}
            {showDeleteModal && 
                <Modal isOpen={showDeleteModal} title="Eliminar registro" onClose={() => setShowDeleteModal(false)}>
                    <div>
                        <p>¿Estás seguro que deseas eliminar este alumno?</p>
                        {user.groups.some(group => group.name === 'Directivo') ? (
                            <Button bg="#FF0000" text="Eliminar" action={handleDelete} />
                        ) : (
                            <p>No tienes permisos para eliminar este alumno.</p>
                        )}
                    </div>
                </Modal>
            }


            {/* Modal para Ver */}
            {showViewModal && dataView && 
                <Modal isOpen={showViewModal} title="Detalles del Alumno" onClose={() => setShowViewModal(false)}>
                    <div>
                        {dataView.students.map((student) => (
                            <div key={student.id}>
                                <Input
                                    placeholder="Nombre"
                                    value={student.nombre}
                                    isDisabled={true}
                                    id="viewInputNombre"
                                    name="nombre"
                                />
                                <Input
                                    placeholder="Apellido Paterno"
                                    value={student.apellidoPaterno}
                                    isDisabled={true}
                                    id="viewInputApellidoPaterno"
                                    name="apellidoPaterno"
                                />
                                <Input
                                    placeholder="Apellido Materno"
                                    value={student.apellidoMaterno}
                                    isDisabled={true}
                                    id="viewInputApellidoMaterno"
                                    name="apellidoMaterno"
                                />
                                <Input
                                    placeholder="Correo Institucional"
                                    value={student.correoInstitucional}
                                    isDisabled={true}
                                    id="viewInputCorreoInstitucional"
                                    name="correoInstitucional"
                                />
                                <Input
                                    placeholder="CURP"
                                    value={student.curp}
                                    isDisabled={true}
                                    id="viewInputCurp"
                                    name="curp"
                                />
                                <Input
                                    placeholder="Escuela de Procedencia"
                                    value={student.escuelaProcedencia}
                                    isDisabled={true}
                                    id="viewInputEscuelaProcedencia"
                                    name="escuelaProcedencia"
                                />
                                <Input
                                    placeholder="Grado y Grupo Asignado"
                                    value={student.gradoGrupoAsignado}
                                    isDisabled={true}
                                    id="viewInputGradoGrupoAsignado"
                                    name="gradoGrupoAsignado"
                                />
                                <Input
                                    placeholder="Sexo"
                                    value={student.sexo}
                                    isDisabled={true}
                                    id="viewInputSexo"
                                    name="sexo"
                                />
                            </div>
                        ))}
                    </div>
                </Modal>
            }

            {/* Modal para Crear */}
            {showCreateModal && 
                <Modal isOpen={showCreateModal} title="Crear registro" onClose={() => setShowCreateModal(false)}>
                    <div>
                        <Input
                            placeholder="Nombre"
                            value={formValues.nombre}
                            onChange={handleInputChange}
                            id="createInputNombre"
                            name="nombre"
                            error={formErrors.nombre}
                        />
                        <Input
                            placeholder="Apellido Paterno"
                            value={formValues.apellidoPaterno}
                            onChange={handleInputChange}
                            id="createInputApellidoPaterno"
                            name="apellidoPaterno"
                            error={formErrors.apellidoPaterno}
                        />
                        <Input
                            placeholder="Apellido Materno"
                            value={formValues.apellidoMaterno}
                            onChange={handleInputChange}
                            id="createInputApellidoMaterno"
                            name="apellidoMaterno"
                            error={formErrors.apellidoMaterno}
                        />
                        <Input
                            placeholder="Correo Institucional"
                            value={formValues.correoInstitucional}
                            onChange={handleInputChange}
                            id="createInputCorreoInstitucional"
                            name="correoInstitucional"
                            error={formErrors.correoInstitucional}
                        />
                        <Input
                            placeholder="CURP"
                            value={formValues.curp}
                            onChange={handleInputChange}
                            id="createInputCurp"
                            name="curp"
                            error={formErrors.curp}
                        />
                        <Input
                            placeholder="Escuela de Procedencia"
                            value={formValues.escuelaProcedencia}
                            onChange={handleInputChange}
                            id="createInputEscuelaProcedencia"
                            name="escuelaProcedencia"
                        />
                        <label htmlFor="">Grado y grupo</label>
                        <div className="grado-grupo">
                            <select
                                name="grado"
                                value={formValues.grado}
                                onChange={handleInputChange}
                                defaultValue={"1"}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                            <select
                                name="grupo"
                                value={formValues.grupo}
                                onChange={handleInputChange}
                                defaultValue={"A"}
                            >
                                <option value="A">A</option>
                                <option value="B">B</option>
                            </select>
                            <br />
                            <label htmlFor="">Sexo</label>
                            <select
                                name="sexo"
                                value={formValues.sexo}
                                onChange={handleInputChange}
                                defaultValue={"M"}
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                        <Button bg="#00BF63" text="Crear Alumno" action={handleAdd} />
                    </div>
                </Modal>
            }

            {/* Modal para Editar */}
            {showEditModal && 
                <Modal isOpen={showEditModal} title="Editar registro" onClose={() => setShowEditModal(false)}>
                    <div>
                        <Input
                            placeholder="Nombre"
                            value={formValues.nombre}
                            onChange={handleInputChange}
                            id="editInputNombre"
                            name="nombre"
                            error={formErrors.nombre}
                        />
                        <Input
                            placeholder="Apellido Paterno"
                            value={formValues.apellidoPaterno}
                            onChange={handleInputChange}
                            id="editInputApellidoPaterno"
                            name="apellidoPaterno"
                            error={formErrors.apellidoPaterno}
                        />
                        <Input
                            placeholder="Apellido Materno"
                            value={formValues.apellidoMaterno}
                            onChange={handleInputChange}
                            id="editInputApellidoMaterno"
                            name="apellidoMaterno"
                            error={formErrors.apellidoMaterno}
                        />
                        <Input
                            placeholder="Correo Institucional"
                            value={formValues.correoInstitucional}
                            onChange={handleInputChange}
                            id="editInputCorreoInstitucional"
                            name="correoInstitucional"
                            error={formErrors.correoInstitucional}
                        />
                        <Input
                            placeholder="CURP"
                            value={formValues.curp}
                            onChange={handleInputChange}
                            id="editInputCurp"
                            name="curp"
                            error={formErrors.curp}
                        />
                        <Input
                            placeholder="Escuela de Procedencia"
                            value={formValues.escuelaProcedencia}
                            onChange={handleInputChange}
                            id="editInputEscuelaProcedencia"
                            name="escuelaProcedencia"
                        />
                        <label htmlFor="">Grado y grupo</label>
                        <div className="grado-grupo">
                            <select
                                name="grado"
                                value={formValues.grado}
                                onChange={handleInputChange}
                                defaultValue={"1"}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                            <select
                                name="grupo"
                                value={formValues.grupo}
                                onChange={handleInputChange}
                                defaultValue={"A"}
                            >
                                <option value="A">A</option>
                                <option value="B">B</option>
                            </select>
                            <br />
                            <label htmlFor="">Sexo</label>
                            <select
                                    name="sexo"
                                    value={formValues.sexo}
                                    onChange={handleInputChange}
                                    defaultValue={"M"}
                                >
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                            </select>
                        </div>
                        <Button bg="#737373" text="Guardar Cambios" action={handleEdit} />
                    </div>
                </Modal>
            }
        </div>
    );
};

export default CrudAlumno;
