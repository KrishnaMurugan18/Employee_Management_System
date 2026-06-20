import { Card } from '../ui/Primitives'
import clsx from 'clsx'

export default function StatCard({ label, value, icon: Icon, tone = 'navy', sublabel }) {
  const tones = {
    navy: 'bg-navy-700 text-amber-300 dark:bg-amber-400 dark:text-navy-950',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300',
  }

  return (
    <Card className="flex items-center gap-4">
      <div className={clsx('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl2', tones[tone])}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-navy-500 dark:text-navy-400">{label}</p>
        <p className="font-display text-2xl font-bold text-navy-900 dark:text-white">{value}</p>
        {sublabel && <p className="text-xs text-navy-400">{sublabel}</p>}
      </div>
    </Card>
  )
}
