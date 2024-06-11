import React from 'react';

const Checkbox = ({ id, name, checked, onChange, children }) => {
    return (
        <div>
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor={id}>{children}</label>
        </div>
    );
};

export default Checkbox;
