'use client';
import { ReactNode, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/authContext';

interface ProtectedPageProps {
  children: ReactNode;
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-500 to-yellow-400">
        <div className="flex flex-col items-center animate-fadeIn"  style={{color:' #bda106ff'}}>

          <div className="relative">
            <svg
              className="w-28 h-28 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M 14 9 L 12 7 L 10 9 M 7 10 L 3 14 L 3 17 A 3 3 0 0 0 9 17 A 3 3 0 0 0 15 17 A 3 3 0 0 0 21 17 L 21 14 L 17 10"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M 12 7 L 12 4 M 12 4 L 10 3 M 12 4 L 14 3"
              />
            </svg>


            <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>


          <h1 className="mt-6 text-3xl font-bold tracking-wide">
            Kwik Eats Admin
          </h1>

          <p className="mt-2 text-lg opacity-90 animate-pulse">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
