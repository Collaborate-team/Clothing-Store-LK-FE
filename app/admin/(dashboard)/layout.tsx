'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('isAdminAuthenticated');
    const user = localStorage.getItem('adminUser') || 'Admin';
    
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      setAdminUser(user);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Persistent */}
      <AdminSidebar adminUser={adminUser} />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm shadow-inner">
        {/* Header */}
        <header className="px-8 py-4 border-b border-black/5 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-black flex items-center gap-2 uppercase">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {adminUser} SESSION
            </h1>
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">
                Management Portal Active
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                 <p className="text-[11px] font-bold text-black uppercase tracking-tight">Access Level</p>
                 <p className="text-[9px] text-[#c8b99a] font-bold uppercase">{adminUser === 'superadmin' ? 'Root Access' : 'Standard Admin'}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs ring-2 ring-black/5 ring-offset-2 uppercase">
                {adminUser[0]}
             </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
           {children}
        </div>
      </main>
    </div>
  );
}