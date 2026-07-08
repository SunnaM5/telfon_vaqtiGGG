import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, ShoppingBag, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface NotificationProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function Notification({ toasts, removeToast }: NotificationProps) {
  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 w-full max-w-xs sm:max-w-md pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void; key?: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <ShoppingBag className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100',
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-100',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-100',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl ${
        bgColors[toast.type]
      } border-neutral-200/20 dark:border-neutral-800/50 bg-white/90 dark:bg-neutral-950/90 text-neutral-800 dark:text-neutral-100`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <span className="text-sm font-medium tracking-tight">{toast.text}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
