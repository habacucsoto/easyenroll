import { isDisabled } from '@testing-library/user-event/dist/utils';
import React from 'react';

// Componente InputReutilizable
const Input = ({ placeholder, type = "text", value, onChange, id, name, isDisabled = false, error }) => {
    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                id={id}
                name={name}
                disabled={isDisabled}
                className={`input-reutilizable ${error ? 'error' : ''}`}
                style={{
                    padding: '6px',
                    borderRadius: '15px',
                    border: error ? '1px solid red' : '1px solid #ccc'
                }}
            />
            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
        </div>
    );
};

export default Input;