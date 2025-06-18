import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts"
import { ResponsiveContainer } from "recharts"

const chartData = [
  { name: "Mon", orders: 40 },
  { name: "Tue", orders: 30 },
  { name: "Wed", orders: 50 },
  { name: "Thu", orders: 70 },
  { name: "Fri", orders: 60 },
  { name: "Sat", orders: 90 },
]

export function ChartAreaInteractive() {
  return (
    <div className="bg-white p-6 rounded-lg shadow w-full">
      <h2 className="text-lg font-semibold mb-4">Weekly Orders</h2>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="orders" stroke="#6366f1" fill="#8b5cf6" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}