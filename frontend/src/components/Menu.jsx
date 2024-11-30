import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import "../css/Menu.css";
import ContextMenuItem from "./ContextMenuItem";
import { useNavigate } from "react-router-dom";

function Menu({ onNewDrawing }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = () => {
    setMenuOpen((v) => !v);
  };

  const nav = useNavigate();

  return (
    <div className="menu-container">
      <button className="menu-button" onClick={toggle}>
        <IoMdMenu className="icon" />
      </button>
      {menuOpen && (
        <ul className="menuBox">
          {/* todo insert these menu items from a map please */}
          <ContextMenuItem>New Drawing</ContextMenuItem>
          <ContextMenuItem onClick={onNewDrawing}>Open</ContextMenuItem>
          <ContextMenuItem onClick={() => nav("/")}>
            View Gallery
          </ContextMenuItem>
          <ContextMenuItem>Download</ContextMenuItem>
          <ContextMenuItem>Share Drawing</ContextMenuItem>
          <ContextMenuItem>Save Drawing</ContextMenuItem>
        </ul>
      )}
    </div>
  );
}
export default Menu;
