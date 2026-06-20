import { Card } from '../ui/Primitives'
import { Activity } from 'lucide-react'

export default function RecentActivity({ activities }) {
  return (
    <Card>
      <h3 className="mb-4 font-display text-base font-semibold text-navy-900 dark:text-white">
        Recent Activity
      </h3>
      {(!activities || activities.length === 0) ? (
        <p className="py-6 text-center text-sm text-navy-400">No recent activity recorded</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((a, i) => (
            <li key={i} className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">
                <Activity size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-navy-800 dark:text-navy-100">
                  <span className="font-medium">{a.performedBy}</span> &mdash; {a.details || a.action}
                </p>
                <p className="text-xs text-navy-400">{a.performedAt}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
