import { useEffect } from "react";

function popUpTabHandler({ tabPopupRef, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen || !tabPopupRef?.current) return;

    const focusableElements = Array.from(
      tabPopupRef.current.querySelectorAll("button, input, select, [tabindex]:not([tabindex='-1'])")
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const trapFocus = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    tabPopupRef.current.addEventListener("keydown", trapFocus);

    return () => {
      tabPopupRef.current.removeEventListener("keydown", trapFocus);
    };
  }, [tabPopupRef, isOpen, onClose]);

  useEffect(() => {
    if (isOpen && tabPopupRef.current) {
      tabPopupRef.current.querySelector("select, button")?.focus();
    }
  }, [isOpen]);
}

export default popUpTabHandler;
