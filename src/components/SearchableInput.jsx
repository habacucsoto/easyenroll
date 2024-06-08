// SearchableInput.js
import React, { useState, useEffect } from 'react';

const SearchableInput = ({ placeholder, data, onFilteredData }) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const filteredData = data.filter(item => {
                if(item.nombre){
                    return item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.apellidoMaterno.toLowerCase().includes(searchTerm.toLowerCase())
                }
                if(item.nombrePadreTutor){
                    return item.nombrePadreTutor.toLowerCase().includes(searchTerm.toLowerCase())
                }
                if(item.idAlumno.nombre){
                    return item.idAlumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.idAlumno.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.idAlumno.apellidoMaterno.toLowerCase().includes(searchTerm.toLowerCase())
                }
            }
        );
        onFilteredData(filteredData);
    }, [searchTerm, data, onFilteredData]);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleChange}
        />
    );
};

export default SearchableInput;
