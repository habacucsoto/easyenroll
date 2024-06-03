import React, { useState } from 'react';
import CrudView from './CrudView';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const GET_STUDENTS = gql`
    query {
        students {
            id
            nombre
            apellidoPaterno
            apellidoMaterno
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

const DELETE_STUDENT = gql`
    mutation DeleteStudent($id: Int!) {
        deleteStudent(id: $id) {
            id
        }
    }
`;

const CrudAlumno = () => {
    const { loading, error, data, refetch } = useQuery(GET_STUDENTS);
    const [createStudent] = useMutation(CREATE_STUDENT, {
        refetchQueries: [{ query: GET_STUDENTS }]
    });
    const [deleteStudent] = useMutation(DELETE_STUDENT, {
        refetchQueries: [{ query: GET_STUDENTS }]
    });

    const [formValues, setFormValues] = useState({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correoInstitucional: '',
        curp: '',
        escuelaProcedencia: '',
        gradoGrupoAsignado: '',
        sexo: ''
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleAdd = async () => {
        try {
            await createStudent({ variables: formValues });
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Error al crear el alumno:', error);
        }
    };

    const handleDelete = async () => {
        console.log('Handle delete for ID:', studentToDelete); // Verifica el ID aquí
        try {
            await deleteStudent({
                variables: { id: studentToDelete },
            });
            setIsDeleteModalOpen(false); // Cierra el modal después de la eliminación
            refetch();
        } catch (error) {
            console.error('Error al eliminar el alumno:', error);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los datos: {error.message}</p>;

    return (
        <div>
            <CrudView
                title="Gestión de Alumnos"
                data={data.students}
                onQuery={(query) => console.log('Consulta con término:', query)}
                onView={(id) => console.log('Ver detalle de:', id)}
                onEdit={(id) => console.log('Editar elemento con ID:', id)}
                onDelete={(id) => {
                    setStudentToDelete(id);
                    setIsDeleteModalOpen(true);
                }}
                onAdd={() => setIsCreateModalOpen(true)}
                createModal={
                    <div>
                        <Input
                            placeholder="Nombre"
                            value={formValues.nombre}
                            onChange={handleInputChange}
                            id="createInputNombre"
                            name="nombre"
                        />
                        <Input
                            placeholder="Apellido Paterno"
                            value={formValues.apellidoPaterno}
                            onChange={handleInputChange}
                            id="createInputApellidoPaterno"
                            name="apellidoPaterno"
                        />
                        <Input
                            placeholder="Apellido Materno"
                            value={formValues.apellidoMaterno}
                            onChange={handleInputChange}
                            id="createInputApellidoMaterno"
                            name="apellidoMaterno"
                        />
                        <Input
                            placeholder="Correo Institucional"
                            value={formValues.correoInstitucional}
                            onChange={handleInputChange}
                            id="createInputCorreoInstitucional"
                            name="correoInstitucional"
                        />
                        <Input
                            placeholder="CURP"
                            value={formValues.curp}
                            onChange={handleInputChange}
                            id="createInputCurp"
                            name="curp"
                        />
                        <Input
                            placeholder="Escuela de Procedencia"
                            value={formValues.escuelaProcedencia}
                            onChange={handleInputChange}
                            id="createInputEscuelaProcedencia"
                            name="escuelaProcedencia"
                        />
                        <Input
                            placeholder="Grado y Grupo Asignado"
                            value={formValues.gradoGrupoAsignado}
                            onChange={handleInputChange}
                            id="createInputGradoGrupoAsignado"
                            name="gradoGrupoAsignado"
                        />
                        <Input
                            placeholder="Sexo"
                            value={formValues.sexo}
                            onChange={handleInputChange}
                            id="createInputSexo"
                            name="sexo"
                        />
                        <Button bg="#00BF63" text="Crear Alumno" action={handleAdd} />
                    </div>
                }
                deleteModal={
                    <div>
                        <p>¿Estás seguro que deseas eliminar este alumno?</p>
                        <Button bg="#FF0000" text="Eliminar" action={handleDelete} />
                    </div>
                }
                editModal={
                    <div>
                        <Input
                            placeholder="Nombre"
                            value=""
                            onChange={(e) => console.log(e.target.value)}
                            id="editInputNombre"
                            name="editInputNombre"
                        />
                        <Input
                            placeholder="Apellido Paterno"
                            value=""
                            onChange={(e) => console.log(e.target.value)}
                            id="editInputApellidoPaterno"
                            name="editInputApellidoPaterno"
                        />
                        <Button bg="#737373" text="Guardar Cambios" action={() => console.log('Guardar cambios')} />
                    </div>
                }
                readModal={
                    <div>
                        <p>Detalles del alumno seleccionado.</p>
                        <Button bg="#F3BA53" text="Cerrar" action={() => console.log('Cerrar detalle')} />
                    </div>
                }
            />

            {/* Modal para Eliminar */}
            {isDeleteModalOpen && 
                <Modal isOpen={isDeleteModalOpen} title="Eliminar registro" onClose={() => setIsDeleteModalOpen(false)}>
                    <div>
                        <p>¿Estás seguro que deseas eliminar este alumno?</p>
                        <Button bg="#FF0000" text="Eliminar" action={handleDelete} />
                    </div>
                </Modal>
            }
        </div>
    );
};

export default CrudAlumno;
