// Código 2: Ine.js
import React from "react";

const Ine = ({ ine }) => {
    return (
        <tr>
            <td>{ine.id}</td>
            <td>{ine.nombre}</td>
            <td>{ine.calle}</td>
            <td>{ine.colonia}</td>
            <td>{ine.codigoPostal}</td>
            <td>{ine.ciudad}</td>
            <td>{ine.estado}</td>
            <td>{ine.fechaNacimiento}</td>
            <td>{ine.sexo}</td>
            <td>{ine.url}</td>
        </tr>
    );
};

export default Ine;
