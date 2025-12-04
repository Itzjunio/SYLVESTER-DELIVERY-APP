"use client";

import { AuthProvider } from "@/context/authContext";
import ProtectedPage from "@/lib/ProtectedPage";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProtectedPage>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6">{children}</main>
              </div>
            </div>
          </ProtectedPage>
        </AuthProvider>
      </body>
    </html>
  );
}


