'use client';
import PageWrapper from '@/components/PageWrapper';
import { RefreshCcw, Save, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-gray-500">Dashboard Page Users Management Pages Orders Page Restaurants Page Settings Page</div>
          <h1 className="text-2xl font-bold">System Settings</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn flex items-center gap-2">
            <RefreshCcw size={16} />
            Reset to Default
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      <h2 className="text-lg font-medium mb-3">Settings Sections</h2>

      <div className="card mb-6">
        <h3 className="text-xl font-semibold mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b last:border-b-0">
            <label htmlFor="delivery-fee" className="text-gray-700">Default Delivery Fee</label>
            <input type="number" id="delivery-fee" defaultValue="2.99" className="form-input w-24 text-right" />
          </div>
          <div className="flex justify-between items-center py-2 border-b last:border-b-0">
            <span className="text-gray-700">Auto-Accept Orders</span>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={autoAcceptOrders}
                  onChange={() => setAutoAcceptOrders(!autoAcceptOrders)}
                />
                <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${autoAcceptOrders ? 'translate-x-full bg-blue-600' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
        <div className="space-y-4">
          <div className="flex items-center py-2 border-b last:border-b-0">
            <span className="text-gray-700 w-40">Operating Hours</span>
            <div className="flex items-center gap-2">
              <input type="text" defaultValue="08:00 AM" className="form-input w-28 text-center" />
              <Clock size={18} className="text-gray-500" />
              <span className="mx-2">to</span>
              <input type="text" defaultValue="10:00 PM" className="form-input w-28 text-center" />
              <Clock size={18} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="text-xl font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b last:border-b-0">
            <span className="text-gray-700">Email Notifications</span>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${emailNotifications ? 'translate-x-full bg-blue-600' : ''}`}></div>
              </div>
            </label>
          </div>
          <div className="flex justify-between items-center py-2 border-b last:border-b-0">
            <span className="text-gray-700">SMS Notifications</span>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={smsNotifications}
                  onChange={() => setSmsNotifications(!smsNotifications)}
                />
                <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${smsNotifications ? 'translate-x-full bg-blue-600' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
