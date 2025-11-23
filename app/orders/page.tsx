'use client';
import PageWrapper from '@/components/PageWrapper';
import { Download, Filter, Eye, Edit } from 'lucide-react';

export default function Orders() {
  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-gray-500">Dashboard Page Users Management Pages Orders Page</div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn flex items-center gap-2">
            <Filter size={16} />
            Advanced Filters
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Download size={16} />
            Export Orders
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Order Status Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card border-l-4 border-yellow-500 p-4">
            <div className="text-3xl font-bold">47</div>
            <div className="text-gray-500">Pending Orders</div>
          </div>
          <div className="card border-l-4 border-blue-500 p-4">
            <div className="text-3xl font-bold">23</div>
            <div className="text-gray-500">In Progress</div>
          </div>
          <div className="card border-l-4 border-green-500 p-4">
            <div className="text-3xl font-bold">156</div>
            <div className="text-gray-500">Delivered Today</div>
          </div>
          <div className="card border-l-4 border-red-500 p-4">
            <div className="text-3xl font-bold">8</div>
            <div className="text-gray-500">Cancelled</div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-medium mb-3">Orders Table</h2>
        <p className="text-gray-500 mb-4">More order rows would be added here</p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Order #</th>
                <th className="py-2 px-4 border-b text-left">Customer</th>
                <th className="py-2 px-4 border-b text-left">Restaurant</th>
                <th className="py-2 px-4 border-b text-left">Rider</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Items</th>
                <th className="py-2 px-4 border-b text-left">Value</th>
                <th className="py-2 px-4 border-b text-left">Time</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b text-blue-600">#3245</td>
                <td className="py-2 px-4 border-b">Sarah Wilson</td>
                <td className="py-2 px-4 border-b">Pizza Palace</td>
                <td className="py-2 px-4 border-b">Mike Johnson</td>
                <td className="py-2 px-4 border-b">
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">DELIVERED</span>
                </td>
                <td className="py-2 px-4 border-b">2 items</td>
                <td className="py-2 px-4 border-b">$24.99</td>
                <td className="py-2 px-4 border-b">12:45 PM</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <button className="text-gray-600 hover:text-blue-600"><Eye size={18} /></button>
                  <button className="text-gray-600 hover:text-blue-600"><Edit size={18} /></button>
                </td>
              </tr>
              {/* More order rows would be added here */}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Restaurants Page Settings Page</h2>
        {/* This seems like a leftover text from the image, I'll assume it's not part of the actual page content */}
      </div>
    </PageWrapper>
  );
}
