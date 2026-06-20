import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '../ui/Primitives'

const COLORS = ['#3c5780', '#e8a33d', '#2f9e68', '#7e97ba', '#d64545', '#243556']

export default function DepartmentDonut({ data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value }))

  return (
    <Card className="h-full">
      <h3 className="mb-4 font-display text-base font-semibold text-navy-900 dark:text-white">
        Department Distribution
      </h3>
      {chartData.length === 0 ? (
        <p className="py-10 text-center text-sm text-navy-400">No department data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={2}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', fontSize: 13 }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
