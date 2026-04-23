import { AxiosInstance } from '../lib/Axios.instance';

export const EmployeeAPI = {
  login: (email, password) => AxiosInstance.post('/employee/login', { email, password }),
  getDashboard: () => AxiosInstance.get('/employee/dashboard'),
  getClients: () => AxiosInstance.get('/employee/clients'),
  createClient: (data) => AxiosInstance.post('/employee/clients', data),
  getClientById: (id) => AxiosInstance.get(`/employee/clients/${id}`),
  assignService: (data) => AxiosInstance.post('/employee/assign-service', data),
  getVisits: () => AxiosInstance.get('/employee/visits'),
  createVisit: (data) => AxiosInstance.post('/employee/visit', data),
  completeVisit: (id) => AxiosInstance.post(`/employee/visit/${id}/complete`, { status: 'completed' }),
  getProfile: () => AxiosInstance.get('/employee/profile'),
};
