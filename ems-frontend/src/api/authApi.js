import apiClient from './apiClient'

export const authApi = {
  login: (payload) => apiClient.post('/auth/login', payload),
  register: (payload) => apiClient.post('/auth/register', payload),
  refresh: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
}
