
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AxiosInstance = axios.create({
    baseURL: `http://192.168.1.12/dashboard/hbs-crm/api`,
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json',
    },
});

AxiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message || "Network error please check your connection";

        if (status === 401 || status === 403) {
            if (typeof window !== "undefined") {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userData');
            }
        }
        return Promise.reject({ status, message: errorMessage });
    }
);
