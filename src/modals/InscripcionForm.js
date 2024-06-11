import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

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

const InscripcionForm = ({ formValues, handleInputChange, onNext, onBack, currentStep }) => {
    const [errors, setErrors] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [selectedStudentName, setSelectedStudentName] = useState('');

    useEffect(() => {
        if (!formValues.modalidadPago) {
            handleInputChange({
                target: {
                    name: 'modalidadPago',
                    value: '12'
                }
            });
        }
        if (!formValues.tipoInscripcion) {
            handleInputChange({
                target: {
                    name: 'tipoInscripcion',
                    value: 'I' 
                }
            });
        }
    }, []);

    const { loading, error, data } = useQuery(GET_STUDENT_BY_NAME, {
        variables: { nombre: formValues.idAlumno },
        skip: !formValues.idAlumno
    });

    const handleSelectStudent = (studentId, studentName) => {
        handleInputChange({
            target: {
                name: 'idAlumno',
                value: studentId
            }
        });
        setSelectedStudentName(studentName);
        setSuggestions([]);
    };

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'idAlumno':
                if (!value) error = 'El nombre del alumno es obligatorio';
                break;
            case 'modalidadPago':
                if (!value) error = 'La modalidad de pago es obligatoria';
                break;
            case 'tipoInscripcion':
                if (!value) error = 'El tipo de inscripción es obligatorio';
                break;
            default:
                break;
        }
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
        return error === '';
    };

    const handleInputChangeWithValidation = (e) => {
        const { name, value } = e.target;
        handleInputChange(e);
        validateField(name, value);
    };

    const validate = () => {
        let isValid = true;
        
        if (!validateField('idAlumno', formValues.idAlumno)) isValid = false;
        if (!validateField('modalidadPago', formValues.modalidadPago)) isValid = false;
        if (!validateField('tipoInscripcion', formValues.tipoInscripcion)) isValid = false;

        return isValid;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
        }
    };

    return (
        <div>
            <h2>Seleccionar Alumno y Llenar Datos</h2>
            <Input
                placeholder="Nombre del alumno"
                value={selectedStudentName || formValues.idAlumno}
                onChange={(e) => {
                    handleInputChangeWithValidation(e);
                    if (e.target.value) {
                        setSuggestions(data ? data.students : []);
                    } else {
                        setSuggestions([]);
                    }
                }}
                onFocus={() => {
                    if (formValues.idAlumno && data && data.students) {
                        setSuggestions(data.students);
                    }
                }}
                id="createInputAlumnoId"
                name="idAlumno"
            />
            {errors.idAlumno && <div style={{ color: 'red' }}>{errors.idAlumno}</div>}
            {suggestions.length > 0 && (
                <div>
                    {suggestions.map(student => (
                        <div
                            key={student.id}
                            onClick={() => handleSelectStudent(student.id, `${student.nombre} ${student.apellidoPaterno} ${student.apellidoMaterno}`)}
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                padding: '5px',
                                margin: '5px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            {student.nombre} {student.apellidoPaterno} {student.apellidoMaterno}
                        </div>
                    ))}
                </div>
            )}
            
            <label htmlFor="createInputModalidadPago">Modalidad de pago:</label>
            <select
                id="createInputModalidadPago"
                name="modalidadPago"
                value={formValues.modalidadPago}
                onChange={handleInputChangeWithValidation}
                defaultValue="12" 
            >
                <option value="">Modalidad</option>
                <option value="12">12 meses</option>
                <option value="10">10 meses</option>
            </select>
            {errors.modalidadPago && <div style={{ color: 'red' }}>{errors.modalidadPago}</div>}
            
            <br />

            <label htmlFor="createInputTipoInscripcion">Tipo de Inscripción:</label>
            <select
                id="createInputTipoInscripcion"
                name="tipoInscripcion"
                value={formValues.tipoInscripcion}
                onChange={handleInputChangeWithValidation}
                defaultValue="I"
            >
                <option value="">Tipo</option>
                <option value="I">Inscripción</option>
                <option value="R">Reinscripción</option>
            </select>
            {errors.tipoInscripcion && <div style={{ color: 'red' }}>{errors.tipoInscripcion}</div>}
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                    id="createInputFactura"
                    name="factura"
                    checked={formValues.factura}
                    onChange={handleInputChange}
                />
                <label htmlFor="createInputFactura" style={{ marginLeft: '5px' }}>Factura</label>
            </div>

            <div style={{ marginTop: '20px' }}>
                {currentStep !== 1 && <Button bg="#737373" text="Atrás" action={onBack} />}
                {currentStep !== 3 && <Button bg="#00BF63" text="Siguiente" action={handleNext} />}
            </div>
        </div>
    );
};

export default InscripcionForm;
