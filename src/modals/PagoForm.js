import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

const PagoForm = ({ formValues, handleInputChange, onNext }) => {
    return (
        <div>
            <h2>Registrar Pago</h2>
            <Input
                placeholder="Recibo"
                value={formValues.recibo}
                onChange={handleInputChange}
                id="createInputRecibo"
                name="recibo"
            />
            <Input
                placeholder="Descuento"
                value={formValues.descuento}
                onChange={handleInputChange}
                id="createInputDescuento"
                name="descuento"
            />
            <Input
                placeholder="ID Recibo"
                value={formValues.idRecibo}
                onChange={handleInputChange}
                id="createInputIdRecibo"
                name="idRecibo"
            />
            <Input
                placeholder="Monto"
                value={formValues.monto}
                onChange={handleInputChange}
                id="createInputMonto"
                name="monto"
            />
            <Input
                placeholder="Fecha de Pago"
                value={formValues.fechaPago}
                onChange={handleInputChange}
                id="createInputFechaPago"
                name="fechaPago"
            />
            <Input
                placeholder="Método de Pago"
                value={formValues.metodoPago}
                onChange={handleInputChange}
                id="createInputMetodoPago"
                name="metodoPago"
            />
            <Button bg="#00BF63" text="Siguiente" action={onNext} />
        </div>
    );
};

export default PagoForm;
