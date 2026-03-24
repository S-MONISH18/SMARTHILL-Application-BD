import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = ({ phone, password, role }) => {
    if (!phone || !password || !role) {
      return { success: false, message: 'Fill all fields' };
    }

    setCurrentUser({
      name: 'User',
      phone,
      role,
    });

    return { success: true };
  };

  const signup = data => {
    setCurrentUser(data);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);