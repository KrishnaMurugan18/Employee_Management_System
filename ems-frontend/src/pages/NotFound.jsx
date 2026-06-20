import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-light px-4 text-center dark:bg-surface-dark">
      <p className="font-display text-7xl font-bold text-navy-200 dark:text-navy-800">404</p>
      <h1 className="mt-2 font-display text-xl font-semibold text-navy-900 dark:text-white">Page not found</h1>
      <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6">
        <Button>Go home</Button>
      </Link>
    </div>
  )
}
