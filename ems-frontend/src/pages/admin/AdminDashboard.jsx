import { useEffect, useState } from 'react'
import { dashboardApi } from '../../api'
import StatCard from '../../components/dashboard/StatCard'
import DepartmentDonut from '../../components/dashboard/DepartmentDonut'
import GrowthChart from '../../components/dashboard/GrowthChart'
import RecentActivity from '../../components/dashboard/RecentActivity'
import { Spinner } from '../../components/ui/Primitives'
import { Users, UserCheck, UserX, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi
      .getStats()
      .then(({ data }) => setStats(data.data))
      .catch(() => toast.error('Failed to load dashboard statistics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Employees" value={stats.totalEmployees} icon={Users} tone="navy" />
        <StatCard label="Active Employees" value={stats.activeEmployees} icon={UserCheck} tone="success" />
        <StatCard label="Inactive Employees" value={stats.inactiveEmployees} icon={UserX} tone="danger" />
        <StatCard label="Departments" value={stats.totalDepartments} icon={Building2} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GrowthChart data={stats.employeeGrowth} />
        </div>
        <DepartmentDonut data={stats.departmentDistribution} />
      </div>

      <RecentActivity activities={stats.recentActivities} />
    </div>
  )
}
