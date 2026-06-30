import { useEffect, type ReactNode } from "react";
import "./Drawer.css";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ui-drawer-overlay" onClick={onClose} role="presentation">
      <aside
        className="ui-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ui-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ui-drawer__header">
          <h2 id="ui-drawer-title">{title}</h2>
        </header>
        <div className="ui-drawer__body">{children}</div>
        {footer && <footer className="ui-drawer__footer">{footer}</footer>}
      </aside>
    </div>
  );
}
