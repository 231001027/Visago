import { useEffect, useState, type ReactNode } from 'react';
import { X, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  icon,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md vb-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-blue to-brand-dark text-white">
          <h3 className="text-[13px] font-semibold flex items-center gap-2">
            {icon ?? <Info className="w-4 h-4" />}
            {title}
          </h3>
          <button onClick={onClose} className="hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children && <div className="px-4 py-4 text-[13px] text-ink">{children}</div>}
        {footer && <div className="px-4 py-3 bg-gray-50 border-t border-[#E0E0E0] flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: ReactNode;
  confirmText?: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      icon={<AlertTriangle className="w-4 h-4" />}
      footer={
        <>
          <button className="vb-btn bg-white border border-[#D5D9DE] text-ink hover:bg-gray-50" onClick={onClose}>
            Cancel
          </button>
          <button
            className="vb-btn bg-gradient-to-b from-brand-blue to-brand-dark text-white"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </>
      }
    >
      {message}
    </Modal>
  );
}

/* ---------- Toast ---------- */
type ToastType = 'success' | 'error' | 'info';
export interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

export function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  const styles: Record<ToastType, string> = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };
  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertTriangle : Info;
  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-white text-[12px] font-medium shadow-lg ${styles[toast.type]}`}>
        <Icon className="w-4 h-4" />
        {toast.message}
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const show = (type: ToastType, message: string) => {
    setToast({ id: Date.now(), type, message });
    setTimeout(() => setToast(null), 2800);
  };
  return { toast, show };
}
