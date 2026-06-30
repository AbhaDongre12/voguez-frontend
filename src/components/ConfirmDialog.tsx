import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmDialogProvider");
  }
  return ctx.confirm;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({ message: "" });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const close = (result: boolean) => {
    setOpen(false);
    resolveRef.current?.(result);
    resolveRef.current = null;
  };

  const variantClass =
    options.variant === "danger"
      ? "confirm-dialog--danger"
      : options.variant === "warning"
        ? "confirm-dialog--warning"
        : "";

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && (
        <div
          className="modal-overlay confirm-overlay"
          role="presentation"
          onClick={() => close(false)}
        >
          <div
            className={`confirm-dialog ${variantClass}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            onClick={(e) => e.stopPropagation()}
          >
            {options.title && (
              <h2 id="confirm-dialog-title" className="confirm-dialog__title">
                {options.title}
              </h2>
            )}
            <p id="confirm-dialog-message" className="confirm-dialog__message">
              {options.message}
            </p>
            <div className="confirm-dialog__actions">
              <button
                type="button"
                className="btn-outline btn-sm"
                onClick={() => close(false)}
              >
                {options.cancelLabel ?? "Cancel"}
              </button>
              <button
                type="button"
                className={
                  options.variant === "danger"
                    ? "btn-danger btn-sm"
                    : options.variant === "warning"
                      ? "btn-warning btn-sm"
                      : "btn-primary btn-sm"
                }
                onClick={() => close(true)}
              >
                {options.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
