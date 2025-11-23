export default function Table({ columns, data }: { columns: string[]; data: (string|number)[][] }) {
  return (
    <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-50 text-blue-700">
          <tr>{columns.map(c => <th key={c} className="px-4 py-3 text-left font-medium">{c}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row,i) => (
            <tr key={i} className="border-t hover:bg-gray-50 transition">
              {row.map((cell,j)=>(<td key={j} className="px-4 py-2">{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
