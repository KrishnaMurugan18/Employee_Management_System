import clsx from 'clsx'
import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, error, hint, className, ...props }, ref) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-navy-200">{label}</span>
      )}
      <input
        ref={ref}
        className={clsx(
          'focus-ring w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-400 dark:bg-navy-900 dark:text-navy-50',
          error ? 'border-danger' : 'border-navy-200 dark:border-navy-700',
          className,
        )}
        {...props}
      />
      {hint && !error && <span className="mt-1 block text-xs text-navy-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  )
})

export default Input
