import React from 'react';
import { useUser } from '../users/UserContext';

const Home = () => {
  const { user } = useUser();

  if (!user || !user.groups) return <p>Cargando...</p>; // Esperar a que los datos del usuario estén disponibles

  const name = user.firstName;

  const isDirectivo = user.groups.some(group => group.name === 'Directivo');
  const isAdministrativo = user.groups.some(group => group.name === 'Administrativo');

  return (
    <div>
      <h2>Bienvenido</h2>
      <p>Es un gusto verte de vuelta {name && ` ${name}.`}</p>
      {isDirectivo && <p>Puedes crear, editar, visualizar y eliminar información de:</p>}
      {isAdministrativo && !isDirectivo && <p>Puedes crear, editar y visualizar información de:</p>}
      <ul>
        <li>Inscripciones</li>
        <li>Padres/Tutores</li>
        <li>Alumnos</li>
      </ul>
    </div>
  );
};

export default Home;
