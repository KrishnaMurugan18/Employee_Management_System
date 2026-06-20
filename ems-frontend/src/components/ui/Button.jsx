import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-navy-700 text-white hover:bg-navy-800 dark:bg-amber-400 dark:text-navy-950 dark:hover:bg-amber-300',
  secondary: 'bg-navy-100 text-navy-800 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-100 dark:hover:bg-navy-700',
  danger: 'bg-danger text-white hover:bg-red-700',
  ghost: 'bg-transparent text-navy-700 hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-navy-800',
  outline: 'border border-navy-300 text-navy-700 hover:bg-navy-50 dark:border-navy-600 dark:text-navy-100 dark:hover:bg-navy-800',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  type = 'button',
  ...props
}) {
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2.5 text-sm'

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60',
        VARIANTS[variant],
        sizeClasses,
        className,
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
