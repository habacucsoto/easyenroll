import React, { useState } from 'react';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const CREATE_PAYMENT_MUTATION = gql`
    mutation CreatePayment(
        $descuento: Int
        $fechaPago: Date
        $idRecibo: Int
        $metodoPago: String
        $monto: Float
        $recibo: String
    ) {
        createPayment(
            descuento: $descuento
            fechaPago: $fechaPago
            idRecibo: $idRecibo
            metodoPago: $metodoPago
            monto: $monto
            recibo: $recibo
        ) {
            idPago
            recibo
            descuento
            idRecibo
            monto
            fechaPago
            metodoPago
        }
    }
`;

const PaymentModal = ({ isOpen, onClose, onPaymentCreated }) => {
    const [formValues, setFormValues] = useState({
        descuento: 0,
        fechaPago: '',
        idRecibo: 0,
        metodoPago: '',
        monto: 0.0,
        recibo: ''
    });

    const [createPaymentMutation] = useMutation(CREATE_PAYMENT_MUTATION, {
        onCompleted: (data) => {
            console.log('Pago creado:', data.createPayment);
            onPaymentCreated(data.createPayment); // Llama a la función onPaymentCreated con el pago creado
            onClose(); // Cierra el modal después de crear el pago exitosamente
        },
        onError: (error) => {
            console.error('Error al crear el pago:', error);
            // Manejo de errores, como mostrar un mensaje al usuario
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleCreate = () => {
        createPaymentMutation({
            variables: {
                descuento: parseInt(formValues.descuento),
                fechaPago: formValues.fechaPago,
                idRecibo: parseInt(formValues.idRecibo),
                metodoPago: formValues.metodoPago,
                monto: parseFloat(formValues.monto),
                recibo: formValues.recibo
            }
        });
    };

    return (
        <Modal isOpen={isOpen} title="Crear Pago" onClose={onClose}>
            <div>
                <Input
                    placeholder="Descuento"
                    type="number"
                    value={formValues.descuento}
                    onChange={handleInputChange}
                    name="descuento"
                />
                <Input
                    placeholder="Fecha de Pago"
                    type="date"
                    value={formValues.fechaPago}
                    onChange={handleInputChange}
                    name="fechaPago"
                />
                <Input
                    placeholder="ID Recibo"
                    type="number"
                    value={formValues.idRecibo}
                    onChange={handleInputChange}
                    name="idRecibo"
                />
                <Input
                    placeholder="Método de Pago"
                    value={formValues.metodoPago}
                    onChange={handleInputChange}
                    name="metodoPago"
                />
                <Input
                    placeholder="Monto"
                    type="number"
                    step="0.01" // Ajusta el paso según tus necesidades
                    value={formValues.monto}
                    onChange={handleInputChange}
                    name="monto"
                />
                <Input
                    placeholder="Recibo"
                    value={formValues.recibo}
                    onChange={handleInputChange}
                    name="recibo"
                />
                <Button bg="#00BF63" text="Crear Pago" action={handleCreate} />
            </div>
        </Modal>
    );
};

export default PaymentModal;
