import apiClient from './client';

export const AuthService = {
  login: (creds) => apiClient.post('/auth/login', creds),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
};

export const UserService = {
  getById: (id) => apiClient.get(`/user/${id}`),
  update: (id, data) => apiClient.put(`/user/${id}`, data),
  delete: (id) => apiClient.delete(`/user/${id}`),
};

export const PetService = {
  getAll: () => apiClient.get('/pet'),
  getById: (id) => apiClient.get(`/pet/${id}`),
  create: (data) => apiClient.post('/pet', data),
  delete: (id) => apiClient.delete(`/pet/${id}`),
};

export const AdoptionService = {
  getAll: () => apiClient.get('/adoptionrequest'),
  create: (data) => apiClient.post('/adoptionrequest', data), 
  update: (id, data) => apiClient.put(`/adoptionrequest/${id}`, data),
};

export const BreedService = {
  getAll: () => apiClient.get('/breeds'),
};

export const DotationService = {
  getAll: () => apiClient.get('/dotation'),
  create: (data) => apiClient.post('/dotation', data),
};