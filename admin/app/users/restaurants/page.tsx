'use client';
import PageWrapper from '@/components/PageWrapper';
import { Plus, Filter, Star, Clock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Restaurants() {
  const router = useRouter();

  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-gray-500">Dashboard Page Users Management Pages Orders Page Restaurants Page</div>
          <h1 className="text-2xl font-bold">Restaurants Management</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn flex items-center gap-2">
            <Filter size={16} />
            Filter by Category
          </button>
          <button onClick={() => router.push('/users/restaurants/create')} className="btn btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Restaurant
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Restaurant Grid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-4">
            <div className="relative h-40 w-full rounded-lg overflow-hidden mb-4">
              <Image src="/pizza-palace.jpg" alt="Pizza Palace" layout="fill" objectFit="cover" />
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Online</span>
            </div>
            <h3 className="text-xl font-semibold mb-1">Pizza Palace</h3>
            <p className="text-gray-500 text-sm mb-3">Italian • Pizza</p>
            <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400" />
                <span>4.8</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>25-30 min</span>
              </div>
              <span>$2,847/month</span>
            </div>
            <div className="flex gap-2">
              <button className="btn">View Profile</button>
              <button className="btn btn-primary">Manage Menu</button>
            </div>
          </div>
          <p className="text-gray-500">More restaurant cards would be added here</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Settings Page</h2>
        {/* This seems like a leftover text from the image, I'll assume it's not part of the actual page content */}
      </div>
    </PageWrapper>
  );
}
