'use client';
import PageWrapper from '@/components/PageWrapper';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import { Clock, ShoppingCart, User, Clock3 } from 'lucide-react';

export default function Dashboard() {
  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-gray-500">Dashboard Page</div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn">Export Summary</button>
          <button className="btn btn-primary">Refresh Data</button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Metrics Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Active Users" value="12,830" change="+12.5%" />
          <MetricCard title="Today's Orders" value="3,095" change="+8.2%" />
          <MetricCard title="Today's Revenue" value="$NaN" change="+15.3%" />
          <MetricCard title="Pending Approvals" value="129" change="-5.1%" />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Charts and Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartCard title="Revenue Trends" />
          </div>
          <div className="card">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ShoppingCart size={16} />
                </div>
                <div>
                  <div className="font-medium">New Order #3245</div>
                  <div className="text-sm text-gray-500">Pizza Palace - $24.99</div>
                  <div className="text-xs text-gray-400 mt-1">2 minutes ago</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div>
                  <div className="font-medium">New Rider Registration</div>
                  <div className="text-sm text-gray-500">John Smith applied</div>
                  <div className="text-xs text-gray-400 mt-1">15 minutes ago</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="font-medium">Restaurant Approved</div>
                  <div className="text-sm text-gray-500">Burger House is now live</div>
                  <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
