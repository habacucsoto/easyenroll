import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';
import styles from '../styles/login.module.css'; 

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $username: String!
    $password: String!
  ) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    username: '',
    password: '',
  });

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      username: formState.username,
      password: formState.password
    },
    onCompleted: ({ tokenAuth }) => {
      localStorage.setItem(AUTH_TOKEN, tokenAuth.token);
      navigate('/');
    }
  });

  // Handler para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.header}>
          <h1>INICIO DE SESIÓN</h1>
          <img src="/Escudo.png" alt="Logo" />
        </div>
        <div className={styles.form}>
          <h2>SECUNDARIA <br></br>INSTITUTO PATRIA</h2>
          <div>
            <label htmlFor="username">Usuario:</label>
            <input
              value={formState.username}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  username: e.target.value
                })
              }
              type="text"
              id="username"
              placeholder="Your username"
            />
          </div>
          <div style={{ position: 'relative' }}>
            <label htmlFor="password">Contraseña:</label>
            <input
              value={formState.password}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  password: e.target.value
                })
              }
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Your password"
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              👁️
            </span>
          </div>
          <button
            type="submit"
            onClick={login}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
