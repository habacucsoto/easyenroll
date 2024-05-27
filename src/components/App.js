import React, { useState } from "react";
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

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <UserProvider>
      <UserInfo /> {/* Añade UserInfo aquí para cargar la información del usuario */}
      <div className="center w85">
        {isLoggedIn && <Header text={`Hola, ${username}!`} isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        {isLoggedIn && (
          <NavMenu
            items={[
              { icon: "search", text: "Inscripcion", link: "/search" },
              { icon: "home", text: "Inicio", link: "/Home" },
              { icon: "add", text: "Tutor", link: "/create" },
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
