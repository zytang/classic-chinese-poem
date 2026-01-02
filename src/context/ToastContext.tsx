
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Check, X, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000); // Auto dismiss
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`toast toast-${toast.type}`}
                        >
                            <div className="toast-icon">
                                {toast.type === 'success' && <Check size={18} />}
                                {toast.type === 'error' && <AlertCircle size={18} />}
                                {toast.type === 'info' && <Feather size={18} />}
                            </div>
                            <span className="toast-message">{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <style jsx global>{`
                .toast-container {
                    position: fixed;
                    bottom: 32px;
                    right: 32px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    z-index: 9999;
                    pointer-events: none;
                }
                .toast {
                    background: var(--paper-white);
                    padding: 12px 20px;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    pointer-events: auto;
                    min-width: 250px;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .toast-success { border-left: 4px solid var(--jade-green); }
                .toast-error { border-left: 4px solid var(--vermilion-red); }
                .toast-icon { display: flex; align-items: center; justify-content: center; }
                .toast-message { font-family: 'Noto Serif SC', serif; font-size: 0.95rem; color: var(--ink-black); }
            `}</style>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
