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
    const storedUsername = localStorage.getItem('username');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (storedUsername && storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('username', username);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
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
              { icon: "add", text: "Tutor", link: "/crear" },
            ]}
          />
        )}
        <div className="ph3 pv1 background-gray">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/Home" /> : <Login onLogin={handleLogin} />} />
            <Route path="/create" element={<CreateIne />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/Home" element={<Home />} />
          </Routes> 
        </div>
      </div>
    </UserProvider>
  );
};

export default App;