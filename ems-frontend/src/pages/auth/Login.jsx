import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { Briefcase } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const data = await login(form)
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/profile')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light px-4 dark:bg-surface-dark">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl2 bg-navy-700 text-amber-300 dark:bg-amber-400 dark:text-navy-950">
            <Briefcase size={22} />
          </div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">Sign in to your EMS account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl2 border border-navy-100 bg-card-light p-7 shadow-card dark:border-navy-800 dark:bg-card-dark"
        >
          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>

          <div className="rounded-lg bg-navy-50 px-3 py-2 text-xs text-navy-500 dark:bg-navy-900 dark:text-navy-400">
            Demo admin: <span className="font-mono">admin@ems.com</span> /{' '}
            <span className="font-mono">Admin@123</span>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-navy-500 dark:text-navy-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-amber-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
