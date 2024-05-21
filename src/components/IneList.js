import React from "react";
import Ine from "./Ine";
import { useQuery, gql } from "@apollo/client";
import '../styles/index.css';

const INES_QUERY = gql`
    {
        ines {
            id
            nombre
            calle
            colonia
            codigoPostal
            ciudad
            estado
            fechaNacimiento
            sexo
            url
        }
    }
`;

const IneList = () => {
    const { data } = useQuery(INES_QUERY);

    return (
        <div>
            {data && data.ines && (
                <table className="table-ines"> {}
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Calle</th>
                            <th>Colonia</th>
                            <th>Código Postal</th>
                            <th>Ciudad</th>
                            <th>Estado</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Sexo</th>
                            <th>URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.ines.map((ine) => (
                            <Ine key={ine.id} ine={ine} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default IneList;
