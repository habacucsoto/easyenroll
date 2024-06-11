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

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      username: formState.username,
      password: formState.password
    },
    onCompleted: ({ tokenAuth }) => {
      localStorage.setItem(AUTH_TOKEN, tokenAuth.token);
      navigate('/');
      onLogin(formState.username);
    },
    onError: () => {
      setErrorMessage('Verifica los datos ingresados');
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.header}>
          <h1>INICIO DE SESIÓN</h1>
          <img src="/Escudo.png" alt="Logo" />
        </div>
        <div className={styles.form}>
          <h2>SECUNDARIA <br></br>INSTITUTO PATRIA</h2>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <div>
            <label htmlFor="username">Usuario</label>
            <input
              value={formState.username}
              onChange={handleInputChange}
              onFocus={() => setErrorMessage('')}
              type="text"
              id="username"
              name="username"
              placeholder="Your username"
              className={errorMessage ? styles.inputError : ''}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <label htmlFor="password">Contraseña</label>
            <input
              value={formState.password}
              onChange={handleInputChange}
              onFocus={() => setErrorMessage('')}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Your password"
              className={errorMessage ? styles.inputError : ''}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? "/visibility-on.svg" : "/visibility-off.svg"}
                alt="Toggle visibility"
              />
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
