import React, { createContext, useState, useContext } from 'react';
import config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  const login = async (cpf, senha) => {
    try {
      const response = await fetch(config.API_URL+'/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();
      if (data.success) {
        setAuthToken(data.token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
