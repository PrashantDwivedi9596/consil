'use client';
import React, { useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: any; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  const bgColors = {
    info: 'bg-slate-800/95 border-sky-500/30 text-sky-100',
    success: 'bg-slate-800/95 border-emerald-500/30 text-emerald-100',
    warning: 'bg-slate-800/95 border-amber-500/40 text-amber-100',
    error: 'bg-slate-800/95 border-rose-500/40 text-rose-100',
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${bgColors[toast.type as keyof typeof bgColors]}`}
    >
      {icons[toast.type as keyof typeof icons]}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm leading-tight mb-1">{toast.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-700/50 transition"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
