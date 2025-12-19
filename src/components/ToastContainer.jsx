import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import useStore from '../store/useStore';

const Toast = ({ id, type = 'info', message, duration = 3000 }) => {
  const removeToast = useStore((state) => state.removeToast);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, removeToast]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'from-green-500/20 to-green-600/20 border-green-500/50',
    error: 'from-red-500/20 to-red-600/20 border-red-500/50',
    warning: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50',
    info: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  const Icon = icons[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br ${colors[type]} border backdrop-blur-xl shadow-xl animate-slide-down min-w-[300px] max-w-md`}
    >
      <Icon className={`w-5 h-5 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
      <p className="text-white text-sm flex-1">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="text-white/60 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useStore((state) => state.toasts);

  return (
    <div 
      className="fixed top-4 right-4 flex flex-col gap-2 pointer-events-none"
      style={{ zIndex: 'var(--z-toast)' }}
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
