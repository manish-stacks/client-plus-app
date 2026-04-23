import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosInstance } from '../lib/Axios.instance';
import { Alert } from 'react-native';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // 'client' | 'employee'
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.multiGet(['userToken', 'userRole', 'userData']).then(stores => {
      const token = stores[0][1];
      const savedRole = stores[1][1];
      const savedUser = stores[2][1];
      if (token && savedRole) {
        setIsLoggedIn(true);
        setRole(savedRole);
        if (savedUser) setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    });
  }, []);

  const login = async (email, password, loginRole = 'client') => {
    try {
      const endpoint = loginRole === 'employee' ? '/employee/login' : '/client/login';
      const response = await AxiosInstance.post(endpoint, { email, password });

      const token = response.data.token;
      const userData = response.data.data || response.data.user || {};

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', loginRole);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
      setRole(loginRole);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userRole', 'userData']);
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
  };

  const getUserData = async () => {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout, role, user, userData: getUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


/*
import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosInstance } from '../lib/Axios.instance';
import { Alert } from 'react-native';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // when app opens check if user is logged in
    AsyncStorage.getItem('userToken').then(token => {
      if (token) setIsLoggedIn(true);
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    try {
      const response = await AxiosInstance.post('/client/login', { email, password });
      // console.log(" LOGIN RESPONSE:", response.data);
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      // console.log("LOGIN ERROR:", error);
      Alert.alert("Login Failed", error.message || "Something went wrong");
      return false;
    }

  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setIsLoggedIn(false);
  };

  const userData = async () => {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
*/