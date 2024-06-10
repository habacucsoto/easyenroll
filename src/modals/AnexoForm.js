import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

const AnexoForm = ({ formValues, handleInputChange, onSubmit, onBack }) => {
    return (
        <div>
            <h2>Rellenar Anexos y Registrar Inscripción</h2>
            <Input
                type="checkbox"
                label="Carta Buena Conducta"
                checked={formValues.cartaBuenaConducta}
                onChange={handleInputChange}
                id="createInputCartaBuenaConducta"
                name="cartaBuenaConducta"
            />
            <Input
                type="checkbox"
                label="Certificado Primaria"
                checked={formValues.certificadoPrimaria}
                onChange={handleInputChange}
                id="createInputCertificadoPrimaria"
                name="certificadoPrimaria"
            />
            <Input
                type="checkbox"
                label="CURP Alumno"
                checked={formValues.curpAlumno}
                onChange={handleInputChange}
                id="createInputCurpAlumno"
                name="curpAlumno"
            />
            <Input
                type="checkbox"
                label="Acta Nacimiento"
                checked={formValues.actaNacimiento}
                onChange={handleInputChange}
                id="createInputActaNacimiento"
                name="actaNacimiento"
            />
            <Input
                placeholder="Observaciones"
                value={formValues.observaciones}
                onChange={handleInputChange}
                id="createInputObservaciones"
                name="observaciones"
            />
            <Button bg="#737373" text="Atrás" action={onBack} />
            <Button bg="#00BF63" text="Registrar Inscripción" action={onSubmit} />
        </div>
    );
};

export default AnexoForm;
