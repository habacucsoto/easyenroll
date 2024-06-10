import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

const InscripcionForm = ({ formValues, handleInputChange, onNext, onBack }) => {
    return (
        <div>
            <h2>Seleccionar Alumno y Llenar Datos</h2>
            <Input
                placeholder="Alumno ID"
                value={formValues.idAlumno}
                onChange={handleInputChange}
                id="createInputAlumnoId"
                name="idAlumno"
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
            <Input
                placeholder="Factura"
                value={formValues.factura}
                onChange={handleInputChange}
                id="createInputFactura"
                name="factura"
            />
            <Button bg="#737373" text="Atrás" action={onBack} />
            <Button bg="#00BF63" text="Siguiente" action={onNext} />
        </div>
    );
};

export default InscripcionForm;
