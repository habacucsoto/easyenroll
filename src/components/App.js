import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./Header";
import NavMenu from "./NavMenu";
import CreateIne from "./CreateIne";
import Login from "./Login";
import Home from "./Home";
import { UserProvider } from '../users/UserContext';
import UserInfo from '../users/UserInfo';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (storedUsername && storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('isLoggedIn');
  };

  return (
    <UserProvider>
      <UserInfo /> {/* Añade UserInfo aquí para cargar la información del usuario */}
      <div className="center w85">
        {isLoggedIn && <Header text={`Hola, ${username}!`} isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        {isLoggedIn && (
          <NavMenu
            items={[
              { icon: "note_add", text: "Inscripcion", link: "/inscripcion" },
              { icon: "home", text: "Inicio", link: "/home" },
              { icon: "person_add", text: "Tutor", link: "/tutor" },
              { icon: "school", text: "Alumno", link: "/alumno" },
            ]}
          />
        )}
        <div className="ph3 pv1 background-gray">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
            <Route path="/create" element={<CreateIne />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/home" element={<Home />} />
          </Routes> 
        </div>
      </div>
    </UserProvider>
  );
};

export default App;
