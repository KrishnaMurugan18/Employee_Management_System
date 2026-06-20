import { Menu, Sun, Moon, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-navy-100 bg-card-light/90 px-4 backdrop-blur dark:border-navy-800 dark:bg-card-dark/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="focus-ring rounded-lg p-2 text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-lg font-semibold text-navy-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className="focus-ring rounded-lg p-2 text-navy-500 hover:bg-navy-100 dark:text-navy-300 dark:hover:bg-navy-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="focus-ring flex items-center gap-2 rounded-lg p-1.5 hover:bg-navy-100 dark:hover:bg-navy-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-xs font-semibold text-white dark:bg-amber-400 dark:text-navy-950">
              {initials}
            </div>
            <span className="hidden text-sm font-medium text-navy-700 dark:text-navy-200 sm:block">
              {user?.fullName}
            </span>
            <ChevronDown size={16} className="hidden text-navy-400 sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-navy-100 bg-card-light py-1 shadow-card dark:border-navy-800 dark:bg-card-dark">
                <div className="border-b border-navy-100 px-4 py-2 dark:border-navy-800">
                  <p className="truncate text-xs text-navy-400">{user?.email}</p>
                  <p className="text-xs font-medium text-amber-500">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-navy-50 dark:hover:bg-navy-800"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
