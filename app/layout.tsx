import './globals.css';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ToastProvider from '@/components/ToastProvider';

export const metadata = { title: 'Kwik Eats Admin' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <Navbar />
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
