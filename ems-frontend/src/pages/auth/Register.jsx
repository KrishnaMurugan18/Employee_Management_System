import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { Briefcase } from 'lucide-react'

const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.firstName) e.firstName = 'First name is required'
    if (!form.lastName) e.lastName = 'Last name is required'
    if (!form.email) e.email = 'Email is required'
    if (!form.password) {
      e.password = 'Password is required'
    } else if (form.password.length < 8) {
      e.password = 'Must be at least 8 characters'
    } else if (!PASSWORD_PATTERN.test(form.password)) {
      e.password = 'Needs uppercase, lowercase, digit and special character'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(form)
      navigate('/profile')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light px-4 py-10 dark:bg-surface-dark">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl2 bg-navy-700 text-amber-300 dark:bg-amber-400 dark:text-navy-950">
            <Briefcase size={22} />
          </div>
          <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Create your account</h1>
          <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">Join as an employee in minutes</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl2 border border-navy-100 bg-card-light p-7 shadow-card dark:border-navy-800 dark:bg-card-dark"
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              value={form.firstName}
              error={errors.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              label="Last name"
              value={form.lastName}
              error={errors.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Phone number"
            placeholder="+91 90000 00000"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            hint="At least 8 chars, with uppercase, lowercase, digit & symbol"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-navy-500 dark:text-navy-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-amber-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
