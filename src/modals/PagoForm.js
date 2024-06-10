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
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                    placeholder="Descuento"
                    value={formValues.descuento}
                    onChange={handleInputChange}
                    id="createInputDescuento"
                    name="descuento"
                />
                <span style={{ marginLeft: '5px' }}>%</span>
            </div>
            <Input
                placeholder="ID Recibo"
                value={formValues.idRecibo}
                onChange={handleInputChange}
                id="createInputIdRecibo"
                name="idRecibo"
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>$</span>
                <Input
                    placeholder="Monto"
                    value={formValues.monto}
                    onChange={handleInputChange}
                    id="createInputMonto"
                    name="monto"
                />
            </div>
            <Input
                placeholder="Fecha de Pago (AAAA-MM-DD)"
                value={formValues.fechaPago}
                onChange={handleInputChange}
                id="createInputFechaPago"
                name="fechaPago"
            />
            <select
                id="createInputMetodoPago"
                name="metodoPago"
                value={formValues.metodoPago || 'E'}
                onChange={handleInputChange}
            >
                <option value="E">Efectivo</option>
                <option value="T">Tarjeta</option>
                <option value="Tr">Transferencia</option>
            </select>
            <Button bg="#00BF63" text="Siguiente" action={onNext} />
        </div>
    );
};

export default PagoForm;
