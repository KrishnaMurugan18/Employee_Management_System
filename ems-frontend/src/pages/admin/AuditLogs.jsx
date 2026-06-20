import { useEffect, useState } from 'react'
import { auditLogApi } from '../../api'
import { Card, Badge } from '../../components/ui/Primitives'
import { Spinner } from '../../components/ui/Primitives'
import toast from 'react-hot-toast'

const ACTION_TONES = {
  CREATE_EMPLOYEE: 'success',
  UPDATE_EMPLOYEE: 'amber',
  DELETE_EMPLOYEE: 'danger',
  LOGIN: 'neutral',
  REGISTER: 'neutral',
  CHANGE_PASSWORD: 'amber',
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    auditLogApi.getRecent(100)
      .then(({ data }) => setLogs(data.data))
      .catch(() => toast.error('Failed to load audit logs'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-navy-900 dark:text-white">Audit Logs</h2>
        <p className="text-sm text-navy-500 dark:text-navy-400">System activity trail — most recent first</p>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : logs.length === 0 ? (
          <p className="py-10 text-center text-sm text-navy-400">No activity recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-navy-100 dark:border-navy-800">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-navy-500 dark:text-navy-400">Action</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-navy-500 dark:text-navy-400">Performed By</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-navy-500 dark:text-navy-400">Details</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase text-navy-500 dark:text-navy-400">When</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-navy-50 last:border-0 dark:border-navy-800/60">
                    <td className="px-3 py-2.5">
                      <Badge tone={ACTION_TONES[log.action] || 'neutral'}>{log.action}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-navy-700 dark:text-navy-300">{log.performedBy}</td>
                    <td className="px-3 py-2.5 text-navy-600 dark:text-navy-400">{log.details}</td>
                    <td className="px-3 py-2.5 text-xs text-navy-400">
                      {new Date(log.performedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
