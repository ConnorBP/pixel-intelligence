import { useEffect } from "react";

// WARNING: This hook is not working as expected. Implementation is incompatible with react
/*
Warning: Internal React error: Expected static flag was missing. Please notify the React team. Error Component Stack
    at ShareImagePopUp (ShareImagePopUp.jsx?t=1733953772175:21:28)
    at div (<anonymous>)
    at Editor (Editor.jsx:19:39)
    at RenderedRoute (react-router-dom.js?v=832feee2:4069:5)
    at Outlet (react-router-dom.js?v=832feee2:4475:26)
    at JobWatcherProvider (JobWatcherProvider.jsx:74:38)
    at ImageDetailsProvider (ImageDetailsProvider.jsx:6:40)
    at SessionProvider (SessionContext.jsx:8:35)
    at ContextRouteWrapper (<anonymous>)
    at RenderedRoute (react-router-dom.js?v=832feee2:4069:5)
    at Routes (react-router-dom.js?v=832feee2:4539:5)
    at Router (react-router-dom.js?v=832feee2:4482:15)
    at BrowserRouter (react-router-dom.js?v=832feee2:5228:5)
    at App (<anonymous>)
*/
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
  
  useEffect(() => {
    if (!isOpen || !tabPopupRef?.current) return;

    const handleBackgroundClick = (e) => {
      if (tabPopupRef.current && !tabPopupRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleBackgroundClick);

    return () => {
      document.removeEventListener("mousedown", handleBackgroundClick);
    };
  }, [isOpen, tabPopupRef, onClose]);

}

export default popUpTabHandler;
