import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { OCR } from './OCR.js'; 

const jsonData = {
    status: true,
    text:  "UNIDOS\nESTADOS\nMEXICANOS\nM\u00c9XICO\nINSTITUTO NACIONAL ELECTORAL\nCREDENCIAL PARA VOTAR\nNOMBRE\nVERA\nFUENTES\nJORGE ALFREDO\nDOMICILIO\nC NORTE 7 142\nCOL CENTRO 94300\nORIZABA, VER.\nCLAVE DE ELECTOR VRFNJR95081130H900\nCURP VEFJ950811HVZRNR01\nESTADO 30\nLOCALIDAD 0001\nFECHA DE NACIMIENTO\n11\/08\/1995\nSEXO H\nA\u00d1O DE REGISTRO 2013 01\nMUNICIPIO 119\nSECCI\u00d3N 2731\nEMISI\u00d3N 2014 VIGENCIA 2024",
    detectedLanguages: [
        { languageCode: "es", confidence: 0.8189754 },
        { languageCode: "pt", confidence: 0.09109919 },
        { languageCode: "it", confidence: 0.044518284 }
    ],
    executionTimeMS: 1775
};

const ocrInstance = new OCR();

const CREATE_INE_MUTATION = gql`
    mutation CreateIneMutation(
        $nombre: String!
        $calle: String!
        $colonia: String!
        $codigo_postal: String!
        $ciudad: String!
        $estado: String!
        $fecha_nacimiento: String!
        $sexo: String!
        $url: String!
    ) {
        createIne(
        nombre: $nombre
        calle: $calle
        colonia: $colonia
        codigoPostal: $codigo_postal
        ciudad: $ciudad
        estado: $estado
        fechaNacimiento: $fecha_nacimiento
        sexo: $sexo
        url: $url
        )
        {
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

    const CreateIne = () => {
        const navigate = useNavigate();
        const [formState, setFormState] = useState({
            nombre: '',
            calle: '',
            colonia: '',
            codigo_postal: '',
            ciudad: '',
            estado: '',
            fecha_nacimiento: '',
            sexo: '',
            url: '',
        });
        const [fieldsEnabled, setFieldsEnabled] = useState(false); // Estado para habilitar/deshabilitar campos
    
        const handleConsultClick = () => {
            const ineUrl = formState.url;
            ocrInstance.getOcrTextjQueryLocal(ineUrl, (data) => {
                if (data) {
                    setFormState({
                        ...formState,
                        nombre: data.name,
                        calle: data.calle,
                        colonia: data.colonia,
                        codigo_postal: data.cp,
                        ciudad: data.ciudad,
                        estado: data.estado,
                        fecha_nacimiento: data.fechaNacimiento,
                        sexo: data.sexo,
                    });
                    setFieldsEnabled(true); // Habilitar los campos cuando se reciban los datos
                }
            });
        };
    
        const handleInputChange = (key, value) => {
            if (fieldsEnabled) {
                setFormState({
                    ...formState,
                    [key]: value
                });
            }
        };
    
        const [createIne] = useMutation(CREATE_INE_MUTATION, {
            variables: formState,
            onCompleted: () => {
                navigate('/');
            }
        });
    
        const imagenHTML = formState.url ? ocrInstance.agregarImagenURL(formState.url) : null;
    
        return (
            <div>
                <div>
                    <h2>Register INE</h2>
                    <h3>Insert URL from INE</h3>
                    <input
                        value={formState.url}
                        onChange={(e) => setFormState({ ...formState, url: e.target.value })}
                        type="text"
                        placeholder="URL Firebase"
                    />
                    <button className="pointer button" onClick={handleConsultClick}>
                        Consult
                    </button>
                    <h3>Verify Data from INE</h3>
                    <input
                        value={formState.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        type="text"
                        placeholder="Nombre"
                        disabled={!fieldsEnabled} // Deshabilitar si los campos no están habilitados
                    />
                    <input
                        value={formState.calle}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                calle: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Calle"
                        disabled={!fieldsEnabled}
                    />
                    <input
                        value={formState.colonia}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                colonia: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Colonia"
                        disabled={!fieldsEnabled}
                    />
                    <input
                        value={formState.codigo_postal}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                codigo_postal: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Código Postal"
                        disabled={!fieldsEnabled}
                    />
                    <input
                        value={formState.ciudad}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                ciudad: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Ciudad"
                        disabled={!fieldsEnabled}
                    />
                    <input
                        value={formState.estado}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                estado: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Estado"
                        disabled={!fieldsEnabled}
                    />
                    <input
                        value={formState.fecha_nacimiento}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                fecha_nacimiento: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Fecha de Nacimiento"
                        disabled={!fieldsEnabled}
                    />
                    <input
                        value={formState.sexo}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                sexo: e.target.value
                            })
                        }
                        type="text"
                        placeholder="Sexo"
                        disabled={!fieldsEnabled}
                    />
                 {imagenHTML && <div dangerouslySetInnerHTML={{ __html: imagenHTML }}></div>}
                </div>
                <button className="pointer button" onClick={createIne}>
                    Submit
                </button>
            </div>
        );
    };
    
    export default CreateIne;