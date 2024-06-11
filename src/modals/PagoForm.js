import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

const PagoForm = ({ formValues, handleInputChange, onNext }) => {
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'recibo':
                if (!value) error = 'El recibo debe ser una URL válida';
                break;
            case 'descuento':
                if (isNaN(value) || value < 0 || value > 100) error = 'El descuento debe ser un número entre 0 y 100';
                break;
            case 'idRecibo':
                if (!value) error = 'El ID de recibo es obligatorio';
                break;
            case 'monto':
                if (!value || isNaN(value) || value <= 0) error = 'El monto debe ser un número positivo';
                break;
            case 'fechaPago':
                if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) error = 'La fecha de pago debe ser en el formato AAAA-MM-DD';
                break;
            case 'metodoPago':
                if (value === undefined || value === null || value === '') {
                    error = 'El método de pago es obligatorio';
                }
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
        
        if (!validateField('recibo', formValues.recibo)) isValid = false;
        if (!validateField('descuento', formValues.descuento)) isValid = false;
        if (!validateField('idRecibo', formValues.idRecibo)) isValid = false;
        if (!validateField('monto', formValues.monto)) isValid = false;
        if (!validateField('fechaPago', formValues.fechaPago)) isValid = false;
        if (!validateField('metodoPago', formValues.metodoPago)) isValid = false;

        return isValid;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
        }
    };

    return (
        <div>
            <h2>Registrar Pago</h2>
            <Input
                placeholder="Recibo"
                value={formValues.recibo}
                onChange={handleInputChangeWithValidation}
                id="createInputRecibo"
                name="recibo"
            />
            {errors.recibo && <div style={{ color: 'red' }}>{errors.recibo}</div>}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                    placeholder="Descuento"
                    value={formValues.descuento}
                    onChange={handleInputChangeWithValidation}
                    id="createInputDescuento"
                    name="descuento"
                />
                <span style={{ marginLeft: '5px' }}>%</span>
            </div>
            {errors.descuento && <div style={{ color: 'red' }}>{errors.descuento}</div>}
            <Input
                placeholder="ID Recibo"
                value={formValues.idRecibo}
                onChange={handleInputChangeWithValidation}
                id="createInputIdRecibo"
                name="idRecibo"
            />
            {errors.idRecibo && <div style={{ color: 'red' }}>{errors.idRecibo}</div>}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>$</span>
                <Input
                    placeholder="Monto"
                    value={formValues.monto}
                    onChange={handleInputChangeWithValidation}
                    id="createInputMonto"
                    name="monto"
                />
            </div>
            {errors.monto && <div style={{ color: 'red' }}>{errors.monto}</div>}
            <Input
                placeholder="Fecha de Pago (AAAA-MM-DD)"
                value={formValues.fechaPago}
                onChange={handleInputChangeWithValidation}
                id="createInputFechaPago"
                name="fechaPago"
            />
            {errors.fechaPago && <div style={{ color: 'red' }}>{errors.fechaPago}</div>}
            <label>Metodo de pago</label>
            <br />
            <select
                id="createInputMetodoPago"
                name="metodoPago"
                onChange={handleInputChangeWithValidation}
                value={formValues.metodoPago || ''}
            >
                <option value="">Seleccione</option>
                <option value="E">Efectivo</option>
                <option value="T">Tarjeta</option>
                <option value="Tr">Transferencia</option>
            </select>

            {errors.metodoPago && <div style={{ color: 'red' }}>{errors.metodoPago}</div>}
            <Button bg="#00BF63" text="Siguiente" action={handleNext} />
        </div>
    );
};

export default PagoForm;
