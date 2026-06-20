import clsx from 'clsx'
import { forwardRef } from 'react'

const Select = forwardRef(function Select({ label, error, children, className, ...props }, ref) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-navy-200">{label}</span>
      )}
      <select
        ref={ref}
        className={clsx(
          'focus-ring w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-navy-900 dark:bg-navy-900 dark:text-navy-50',
          error ? 'border-danger' : 'border-navy-200 dark:border-navy-700',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  )
})

export default Select
