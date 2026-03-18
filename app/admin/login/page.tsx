'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, ShoppingBag } from 'lucide-react';

const STATIC_USERS = [
  { username: 'sudamsiths', password: 'admin@123' },
  { username: 'keshara12', password: 'admin@123' },
  { username: 'heshan2', password: 'admin@123' },
];

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate logic
    setTimeout(() => {
      const user = STATIC_USERS.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('adminUser', username);
        router.push('/admin/dashboard');
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="w-full max-w-md bg-white rounded-sm shadow-2xl relative z-10 overflow-hidden">
        {/* Luxury Top Border */}
        <div className="h-1 bg-[#c8b99a]"></div>
        
        <div className="p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-4 shadow-xl">
               <ShoppingBag size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-[0.2em] text-black uppercase">Admin Login</h1>
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mt-1">Management Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-sm flex items-center gap-2 text-red-600 animate-fade-in">
                <AlertCircle size={16} />
                <span className="text-[11px] font-bold uppercase tracking-tight">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="username" className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/20 group-focus-within:text-black transition-colors">
                  <User size={16} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/5 border border-black/5 py-3.5 pl-11 pr-4 text-sm text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/20 group-focus-within:text-black transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/5 border border-black/5 py-3.5 pl-11 pr-4 text-sm text-black outline-none focus:bg-white focus:border-[#c8b99a] transition-all rounded-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#c8b99a] hover:text-black transition-all duration-500 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                  <>SIGN IN <Lock size={12} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
