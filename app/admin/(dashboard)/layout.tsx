'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      className="p-2.5 rounded-sm border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-black dark:text-white"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

function AdminLayoutContent({
  children,
  adminUser
}: {
  children: React.ReactNode;
  adminUser: string;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Sidebar - Persistent */}
      <AdminSidebar adminUser={adminUser} />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm shadow-inner">
        {/* Header */}
        <header className="px-8 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-20 transition-colors duration-500">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 uppercase">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {adminUser} SESSION
            </h1>
            <p className="text-[10px] text-foreground/70 font-bold uppercase tracking-widest">
                Management Portal Active
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <ThemeToggle />
             <div className="text-right hidden sm:block">
                 <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">Access Level</p>
                 <p className="text-[9px] text-brand font-bold uppercase">{adminUser === 'superadmin' ? 'Root Access' : 'Standard Admin'}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs ring-2 ring-foreground/5 ring-offset-2 uppercase transition-colors">
                {adminUser?.[0] || 'A'}
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-foreground/10 border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AdminLayoutContent adminUser={adminUser}>
        {children}
      </AdminLayoutContent>
    </ThemeProvider>
  );
}