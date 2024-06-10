import React from 'react';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';

const AnexoForm = ({ formValues, handleInputChange, onSubmit, onBack }) => {
    return (
        <div>
            <h2>Rellenar Anexos y Registrar Inscripción</h2>
            <Checkbox
                id="createInputCartaBuenaConducta"
                name="cartaBuenaConducta"
                checked={formValues.cartaBuenaConducta}
                onChange={handleInputChange}
            >
                Buena conducta
            </Checkbox>
            <Checkbox
                id="createInputCertificadoPrimaria"
                name="certificadoPrimaria"
                checked={formValues.certificadoPrimaria}
                onChange={handleInputChange}
            >
                Certificado de primaria
            </Checkbox>
            <Checkbox
                id="createInputCurpAlumno"
                name="curpAlumno"
                checked={formValues.curpAlumno}
                onChange={handleInputChange}
            >
                CURP del alumno
            </Checkbox>
            <Checkbox
                id="createInputActaNacimiento"
                name="actaNacimiento"
                checked={formValues.actaNacimiento}
                onChange={handleInputChange}
            >
                Acta de nacimiento
            </Checkbox>

            <Button bg="#737373" text="Atrás" action={onBack} />
            <Button bg="#00BF63" text="Registrar Inscripción" action={onSubmit} />
        </div>
    );
};

export default AnexoForm;
