import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '../ui/Primitives'

export default function GrowthChart({ data }) {
  return (
    <Card className="h-full">
      <h3 className="mb-4 font-display text-base font-semibold text-navy-900 dark:text-white">
        Employee Growth (Last 6 Months)
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data || []}>
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8a33d" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#e8a33d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 13 }} />
          <Area type="monotone" dataKey="count" stroke="#e8a33d" strokeWidth={2.5} fill="url(#growthGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
