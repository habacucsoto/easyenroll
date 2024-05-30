import { isDisabled } from '@testing-library/user-event/dist/utils';
import React from 'react';

// Componente InputReutilizable
const Input = ({ placeholder, type = "text", value, onChange, id, name, isDisabled = false }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            id={id}
            name={name}
            disabled={isDisabled}
            className="input-reutilizable"
            style={{
                padding: '6px',
                borderRadius: '15px',
                border: '1px solid #ccc'
            }}
        />
    );
};

export default Input;