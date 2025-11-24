export default function MetricCard({ title, value, change }: { title: string; value: string; change?: string }) {
  return (
    <div className="card hover:shadow-lg transition">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="flex items-center justify-between mt-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        {change && <div className={change.startsWith('-') ? 'text-red-500' : 'text-green-600'}>{change}</div>}
      </div>
    </div>
  );
}
