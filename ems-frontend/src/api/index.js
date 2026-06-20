import apiClient from './apiClient'

export { employeeApi } from './employeeApi'
export { authApi } from './authApi'

export const departmentApi = {
  getAll: () => apiClient.get('/departments'),
  create: (payload) => apiClient.post('/departments', payload),
  update: (id, payload) => apiClient.put(`/departments/${id}`, payload),
  remove: (id) => apiClient.delete(`/departments/${id}`),
}

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
}

export const userApi = {
  changePassword: (payload) => apiClient.put('/users/change-password', payload),
}

export const auditLogApi = {
  getRecent: (limit = 50) => apiClient.get('/audit-logs', { params: { limit } }),
}
