import { useEffect } from "react";

function tabHandler(menuRef, setMenuOpen) {
  useEffect(() => {

    const keyDownHandler = (e) => {
      const menuItems = Array.from(
        menuRef.current?.querySelectorAll("li, button") || []
      );
      const currentIndex = menuItems.indexOf(document.activeElement);

      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);

      } else if (e.key === "Enter" && currentIndex !== -1) {
        e.preventDefault();
        if (currentIndex !== -1 && menuItems[currentIndex]) {
          menuItems[currentIndex]?.click();
        }
      }
    }
    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.addEventListener("keydown", keyDownHandler);
    }
    return () => {
      if (menuElement) {
        menuElement.removeEventListener("keydown", keyDownHandler);
      }
    };
  }, [menuRef, setMenuOpen]);
}

export default tabHandler;
