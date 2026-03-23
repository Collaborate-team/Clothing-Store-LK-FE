'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ModalOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info' | 'warning';
}

interface ModalContextProps {
  showConfirm: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const showConfirm = (options: ModalOptions) => {
    setModal(options);
  };

  const closeModal = () => {
    setModal(null);
  };

  const handleConfirm = () => {
    if (modal) {
      modal.onConfirm();
      closeModal();
    }
  };

  return (
    <ModalContext.Provider value={{ showConfirm, closeModal }}>
      {children}
      
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-sm shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                   <div className={`p-3 rounded-full ${modal.type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      <AlertTriangle size={24} />
                   </div>
                   <button onClick={closeModal} className="text-black/20 hover:text-black transition-colors">
                      <X size={20} />
                   </button>
                </div>

                <div className="space-y-2">
                   <h3 className="text-lg font-bold uppercase tracking-tight text-black">{modal.title}</h3>
                   <p className="text-sm text-black/60 leading-relaxed font-medium">
                     {modal.message}
                   </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                   <button 
                     onClick={handleConfirm}
                     className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                       modal.type === 'danger' ? 'bg-red-600 text-white hover:bg-black' : 'bg-black text-white hover:bg-[#c8b99a] hover:text-black'
                     }`}
                   >
                     {modal.confirmText || 'Confirm'}
                   </button>
                   <button 
                     onClick={closeModal}
                     className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black border border-black/5 hover:bg-black/5 transition-all"
                   >
                     {modal.cancelText || 'Cancel'}
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};