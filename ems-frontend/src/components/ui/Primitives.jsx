import clsx from 'clsx'

export function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-xl2 border border-navy-100 bg-card-light p-5 shadow-soft dark:border-navy-800 dark:bg-card-dark',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Badge({ children, tone = 'neutral', className }) {
  const tones = {
    neutral: 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
  }
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}

export function Spinner({ size = 24, className }) {
  return (
    <div
      className={clsx('animate-spin rounded-full border-2 border-navy-200 border-t-amber-400', className)}
      style={{ width: size, height: size }}
    />
  )
}
