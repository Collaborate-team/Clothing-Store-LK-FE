'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
}

interface NotificationContextProps {
  showNotification: (message: string, type: NotificationType, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType, title?: string) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { id, message, type, title }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Notification UI Overlay */}
      <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-4 w-[350px] pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`relative bg-white border border-black/5 p-5 shadow-2xl rounded-sm flex gap-4 overflow-hidden group`}>
                {/* Visual Type Indicator Accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    n.type === 'success' ? 'bg-green-500' :
                    n.type === 'error' ? 'bg-red-500' :
                    n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>

                <div className={`mt-1 ${
                    n.type === 'success' ? 'text-green-500' :
                    n.type === 'error' ? 'text-red-500' :
                    n.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                }`}>
                   {n.type === 'success' && <CheckCircle2 size={18} />}
                   {n.type === 'error' && <XCircle size={18} />}
                   {n.type === 'warning' && <AlertCircle size={18} />}
                   {n.type === 'info' && <AlertCircle size={18} />}
                </div>

                <div className="flex-1">
                   {n.title && (
                     <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-1">
                       {n.title}
                     </h4>
                   )}
                   <p className="text-[11px] font-bold text-black/60 uppercase tracking-tight leading-relaxed">
                     {n.message}
                   </p>
                </div>

                <button 
                  onClick={() => removeNotification(n.id)}
                  className="text-black/20 hover:text-black transition-colors self-start"
                >
                   <X size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
