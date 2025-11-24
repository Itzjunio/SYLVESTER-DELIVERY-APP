'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [{ name: 'Mon', value: 400 }, { name: 'Tue', value: 800 }, { name: 'Wed', value: 600 }, { name: 'Thu', value: 1200 }, { name: 'Fri', value: 1600 }];

export default function ChartCard({ title='Chart' }: { title?: string }) {
  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
