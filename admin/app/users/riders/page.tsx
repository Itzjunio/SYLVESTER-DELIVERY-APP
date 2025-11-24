'use client';
import PageWrapper from '@/components/PageWrapper';
import { Plus, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Riders() {
  const router = useRouter();

  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-gray-500">Dashboard Page Users Management Pages</div>
          <h1 className="text-2xl font-bold">Riders Management</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
          <button onClick={() => router.push('/users/riders/create')} className="btn btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Rider
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-medium mb-3">Filters</h2>
        <div className="flex gap-4">
          <select className="form-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select className="form-select">
            <option>Car</option>
            <option>Motorcycle</option>
            <option>Bicycle</option>
          </select>
          <input type="text" placeholder="Search riders..." className="form-input flex-grow" />
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-medium mb-3">Riders Table</h2>
        <p className="text-gray-500 mb-4">More rider rows would be added here</p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email/Phone</th>
                <th className="py-2 px-4 border-b text-left">Vehicle Type</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Total Earnings</th>
                <th className="py-2 px-4 border-b text-left">Last Active</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Rider rows will be dynamically loaded here */}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Pagination</h2>
        <div className="flex gap-2">
          <button className="btn">Previous</button>
          <span className="py-2 px-4">Page 1 of 25</span>
          <button className="btn">Next</button>
        </div>
      </div>
    </PageWrapper>
  );
}
