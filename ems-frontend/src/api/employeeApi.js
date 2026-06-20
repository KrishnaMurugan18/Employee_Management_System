import apiClient from './apiClient'

export const employeeApi = {
  search: (params) => apiClient.get('/employees', { params }),
  getById: (id) => apiClient.get(`/employees/${id}`),
  create: (payload) => apiClient.post('/employees', payload),
  update: (id, payload) => apiClient.put(`/employees/${id}`, payload),
  remove: (id) => apiClient.delete(`/employees/${id}`),
  getMyProfile: () => apiClient.get('/employees/me'),
  updateMyProfile: (payload) => apiClient.put('/employees/me', payload),
  uploadImage: (id, formData) =>
    apiClient.post(`/employees/${id}/profile-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  exportExcel: (params) =>
    apiClient.get('/employees/export', { params, responseType: 'blob' }),
}
