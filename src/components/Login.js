import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { AUTH_TOKEN } from '../constants';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $username: String!
    $password: String!
  ) {
    createUser(
      email: $email
      username: $username
      password: $password
    ) {
      user{
        id
        username
        email
      }
    }
  }
`;

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
    login: true,
    email: '',
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
  
  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      email: formState.email,
      username: formState.username,
      password: formState.password
    },
    onCompleted: ({ createUser }) => {
      localStorage.setItem(AUTH_TOKEN, createUser.token);
      navigate('/');
    }
  });

  // Handler para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container">
      <div className="header">
        <img src="Escudo.png" alt="Logo" />
        <h1>Inicio de Sesión</h1>
      </div>
      <div className="form">
        <h2>Secundaria Instituto Patria</h2>
        {!formState.login && (
          <div>
            <label htmlFor="email">Correo:</label>
            <input
              value={formState.email}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  email: e.target.value
                })
              }
              type="email"
              id="email"
              placeholder="example@mail.com"
            />
          </div>
        )}
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
            placeholder="Choose a safe password"
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </span>
        </div>
        <button
          type="submit"
          onClick={formState.login ? login : signup}
        >
          {formState.login ? 'Entrar' : 'Crear cuenta'}
        </button>
        <button
          type="button"
          onClick={() =>
            setFormState({
              ...formState,
              login: !formState.login
            })
          }
        >
          {formState.login
            ? '¿Necesitas crear una cuenta?'
            : '¿Ya tienes una cuenta?'}
        </button>
      </div>
    </div>
  );
};

export default Login;
