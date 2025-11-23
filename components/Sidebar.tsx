'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Truck, Store, CreditCard, BarChart3, Bell, Settings, Menu, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const menu = [
  { name: 'Dashboard', href: '/', icon: Home },
  {
    name: 'User Management',
    icon: Users,
    children: [
      { name: 'Riders', href: '/users/riders', icon: Truck },
      { name: 'Customers', href: '/users/customers', icon: Users },
      { name: 'Restaurants', href: '/users/restaurants', icon: Store },
    ]
  },
  { name: 'Orders', href: '/orders', icon: CreditCard },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings }
];

export default function Sidebar() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [userManagementOpen, setUserManagementOpen] = useState(false);

  return (
    <aside className={clsx('bg-white border-r min-h-screen p-4 transition-all', collapsed ? 'w-20' : 'w-72')} onMouseEnter={() => setCollapsed(false)} onMouseLeave={() => setCollapsed(true)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">KE</div>
          {!collapsed && <div className="text-lg font-semibold">Kwik Eats</div>}
        </div>
        <Menu size={16} className="text-gray-500" />
      </div>

      <nav className="space-y-2">
        {menu.map((m) => {
          const Icon = m.icon;
          const active = path === m.href;

          if (m.children) {
            return (
              <div key={m.name}>
                <button
                  onClick={() => setUserManagementOpen(!userManagementOpen)}
                  className={clsx('flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition', userManagementOpen || path.startsWith('/users') ? 'bg-blue-50 text-blue-700' : 'text-gray-600')}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    {!collapsed && <span className="font-medium">{m.name}</span>}
                  </div>
                  {!collapsed && <ChevronDown size={16} className={clsx('transition-transform', userManagementOpen ? 'rotate-180' : 'rotate-0')} />}
                </button>
                {!collapsed && userManagementOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    {m.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = path === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition', childActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600')}
                        >
                          <ChildIcon size={18} />
                          <span className="font-medium">{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={m.href}
              href={m.href}
              className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition', active ? 'bg-blue-50 text-blue-700' : 'text-gray-600')}
            >
              <Icon size={18} />
              {!collapsed && <span className="font-medium">{m.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
