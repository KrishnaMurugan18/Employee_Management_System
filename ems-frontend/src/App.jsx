import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'

import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import EmployeeList from './pages/admin/EmployeeList'
import DepartmentManagement from './pages/admin/DepartmentManagement'
import AuditLogs from './pages/admin/AuditLogs'
import EmployeeProfile from './pages/employee/EmployeeProfile'
import NotFound from './pages/NotFound'

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/profile'} replace />
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AppLayout title="Admin Console" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<EmployeeList />} />
            <Route path="/admin/departments" element={<DepartmentManagement />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']} />}>
          <Route element={<AppLayout title="My Profile" />}>
            <Route path="/profile" element={<EmployeeProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
