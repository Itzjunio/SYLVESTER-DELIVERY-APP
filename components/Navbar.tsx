'use client';
import ThemeToggle from './ThemeToggle';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function Navbar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3); // Example: initial notification count

    // In a real application, you would fetch notifications here

    return (
        <header className="flex items-center justify-between bg-white p-4 border-b">
            <div className="flex items-center gap-4">
                <input placeholder="Search orders, users, restaurants..." className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 w-80" />
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                </div>
                <div className="relative">
                    <button
                        className="flex items-center gap-2"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={20} className="text-gray-600" />
                        </div>
                        <span className="font-medium">Admin User</span>
                        <ChevronDown size={16} className={dropdownOpen ? 'rotate-180' : ''} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-10">
                            <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100">
                                <User size={16} /> Profile
                            </a>
                            <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100">
                                <Settings size={16} /> Settings
                            </a>
                            <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
}
