import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // App khulne pe check karo token hai ya nahi
    AsyncStorage.getItem('userToken').then(token => {
      if (token) setIsLoggedIn(true);
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    // Mock auth — real app mein API call hoga
    if (email && password) {
      await AsyncStorage.setItem('userToken', 'mock-token-123');
      await AsyncStorage.setItem('userEmail', email);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);