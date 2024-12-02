import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import "../css/Menu.css";
import ContextMenuItem from "./ContextMenuItem";

const testingItems= [
  { text: "New Todo", onClick: ()=> alert('todo') },
  { text: "DEMO OPTION", onClick: ()=> alert('todo') },
  { text: "TODO#3", onClick: ()=> alert('todo') },
];

// console.log(testingItems);

function Menu({ menuOptions = testingItems }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = () => {
    setMenuOpen((v) => !v);
  };



  const listItems = menuOptions.map(({text, onClick}, idx) => {
    // console.log(`mapping item ${idx} ${text}`);
    return <ContextMenuItem onClick={onClick} key={`${text} ${idx}`}>{text}</ContextMenuItem>;
  });
  // console.log(listItems);

  return (
    <div className="menu-container">
      <button className="menu-button" onClick={toggle}>
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
