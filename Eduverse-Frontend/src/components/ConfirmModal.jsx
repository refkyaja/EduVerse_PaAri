import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, RefreshCcw, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Tindakan",
  description = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = "warning"
}) {
  if (!isOpen) return null;

  let iconColor = "bg-warning/15 text-warning border-warning/30";
  let buttonColor = "bg-warning text-black hover:bg-warning/90 shadow-warning/20";

  if (variant === 'danger') {
    iconColor = "bg-danger/15 text-danger border-danger/30";
    buttonColor = "bg-danger text-white hover:bg-danger/90 shadow-danger/20";
  } else if (variant === 'primary') {
    iconColor = "bg-primary/15 text-primary border-primary/30";
    buttonColor = "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow";
  }

  const handleConfirmAction = () => {
    onConfirm();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Soft Backdrop Overlay */}
      <div
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
        className="fixed inset-0 bg-black/45 backdrop-blur-[3px] z-0 animate-fade-in"
      />

      {/* Custom Modal Dialog (Perfect Screen Center) */}
      <div className="relative z-10 w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-2xl animate-scale-in space-y-5 select-none">
        <div className="flex items-start justify-between gap-4">
          <div className={`w-12 h-12 rounded-2xl ${iconColor} border flex items-center justify-center shrink-0 shadow-inner`}>
            {variant === 'danger' ? (
              <Trash2 className="w-6 h-6" />
            ) : variant === 'primary' ? (
              <RefreshCcw className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-extrabold text-foreground tracking-tight leading-snug">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-extrabold text-xs transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirmAction}
            className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
