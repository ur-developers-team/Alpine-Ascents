import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Heart, Bookmark, Globe, Sliders, Info, X } from 'lucide-react';
import './ToastContainer.css';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3200) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 at once

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  React.useEffect(() => {
    const handleCustomToast = (e) => {
      if (e.detail && e.detail.message) {
        addToast(e.detail.message, e.detail.type || 'info', e.detail.duration || 3200);
      }
    };
    window.addEventListener('alpine-toast', handleCustomToast);
    return () => window.removeEventListener('alpine-toast', handleCustomToast);
  }, [addToast]);

  const getIcon = (type) => {
    switch (type) {
      case 'wishlist-add':
        return <Heart size={18} fill="#ef4444" color="#ef4444" />;
      case 'wishlist-remove':
        return <Heart size={18} color="var(--text-muted, #94a3b8)" />;
      case 'trip':
        return <Bookmark size={18} color="var(--accent, #d4af37)" />;
      case 'language':
        return <Globe size={18} color="#38bdf8" />;
      case 'checklist':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'preferences':
        return <Sliders size={18} color="#a855f7" />;
      case 'success':
        return <CheckCircle2 size={18} color="#10b981" />;
      default:
        return <Info size={18} color="var(--accent, #d4af37)" />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="alpine-toast-container" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`alpine-toast-card alpine-toast-${toast.type}`}>
            <div className="alpine-toast-icon">
              {getIcon(toast.type)}
            </div>
            <div className="alpine-toast-message">
              {toast.message}
            </div>
            <button
              className="alpine-toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
            <div
              className="alpine-toast-progress"
              style={{ animationDuration: `${toast.duration}ms` }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
