import { useState, useEffect, useRef } from "react";
import { IoMdMenu } from "react-icons/io";
import "../css/Menu.css";
import ContextMenuItem from "./ContextMenuItem";
import tabHandler from "../hooks/tabHandler";

const testingItems = [
  { text: "New Todo", onClick: () => alert('todo') },
  { text: "DEMO OPTION", onClick: () => alert('todo') },
  { text: "TODO#3", onClick: () => alert('todo') },
];

// console.log(testingItems);

function Menu({ menuOptions = testingItems }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = () => {
    setMenuOpen((v) => !v);
  };

  // Create a reference to the menu container element
  let menuRef = useRef();

  useEffect(() => {
    // Function to handle clicks outside the menu
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    // Add as mouse click event listener to the entire document
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler); // For mobile phones

    // Remove the event listener
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    }
  })
  tabHandler(menuRef, setMenuOpen);
  const listItems = menuOptions.map(({ text, onClick }, idx) => {
    // console.log(`mapping item ${idx} ${text}`);
    return <ContextMenuItem onClick={() => { toggle(); onClick();}} key={`${text} ${idx}`}>{text}</ContextMenuItem>;
  });
  // console.log(listItems);

  return (
    <div className="menu-container" ref={menuRef}>
      <button className={`menu-button ${menuOpen ? "" : "tooltip"}`} button-name="Menu" onClick={toggle} tabIndex={0}>
        <IoMdMenu className="icon" />
      </button>
      {menuOpen && (
        <ul className="menuBox">
          {listItems}
        </ul>
      )}
    </div>
  );
}
export default Menu;

// className={`icon ${tool === "eraser" ? "active" : ""}`}