import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCircle,
  ScrollText,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/employees', label: 'Employees', icon: Users },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
]

const EMPLOYEE_LINKS = [{ to: '/profile', label: 'My Profile', icon: UserCircle }]

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth()
  const links = isAdmin ? ADMIN_LINKS : EMPLOYEE_LINKS

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-navy-100 bg-card-light transition-transform duration-200 dark:border-navy-800 dark:bg-card-dark lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-navy-100 px-5 dark:border-navy-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 font-display text-sm font-bold text-amber-300 dark:bg-amber-400 dark:text-navy-950">
              EM
            </div>
            <span className="font-display text-lg font-semibold text-navy-900 dark:text-white">EMS</span>
          </div>
          <button onClick={onClose} className="text-navy-400 lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'focus-ring flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-navy-700 text-white dark:bg-amber-400 dark:text-navy-950'
                    : 'text-navy-600 hover:bg-navy-100 dark:text-navy-300 dark:hover:bg-navy-800',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
