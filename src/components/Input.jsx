import React from 'react';

// Componente InputReutilizable
const Input = ({ placeholder, type = "text", value, onChange, id, name }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            id={id}
            name={name}
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