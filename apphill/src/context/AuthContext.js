import React, { createContext, useContext, useState } from 'react';

// ✅ API SERVICE
import { loginUser, createUser } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // ================= LOGIN =================
  const login = async ({ phone, password, role }) => {
    try {
      if (!phone || !password || !role) {
        return { success: false, message: 'Fill all fields' };
      }

      const result = await loginUser(phone, password);

      if (!result.success) {
        return { success: false, message: result.message || 'Invalid credentials' };
      }

      // ✅ Role validation
      if (result.user.role !== role) {
        return { success: false, message: 'Wrong role selected' };
      }

      console.log('✅ LOGIN USER OBJECT:', JSON.stringify(result.user, null, 2));
      setCurrentUser(result.user);

      return { success: true };
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, message: 'Login error' };
    }
  };

  // ================= SIGNUP =================
  const signup = async (userData) => {
    try {
      if (!userData.phone || !userData.password || !userData.role) {
        return { success: false, message: 'Fill all fields' };
      }

      const result = await createUser(userData);

      if (!result.success) {
        return { success: false, message: result.message || 'Signup failed' };
      }

      // 🔥 IMPORTANT: Set the full user object with all fields from backend
      // This ensures name and other fields are properly stored
      setCurrentUser({
        userId: userData.phone,
        name: userData.name || userData.phone,
        phone: userData.phone,
        role: userData.role,
      });

      return { success: true };
    } catch (error) {
      console.error('Signup Error:', error);
      return { success: false, message: 'Signup error' };
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        setCurrentUser, // useful for manual updates
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= HOOK =================
export const useAuth = () => useContext(AuthContext);