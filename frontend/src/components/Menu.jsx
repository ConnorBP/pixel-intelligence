import {useState} from "react";
import { IoMdMenu } from "react-icons/io";
import '../css/Menu.css'
import ContextMenuItem from "./ContextMenuItem";
function Menu(){

 const [ menuOpen, setMenuOpen] = useState(false);
 const toggle = () =>{
    setMenuOpen((v) => !v);
 };
 return(
  <div className="menu-container">
    <button className="menu-button" onClick={toggle}><IoMdMenu className="icon" /></button>
    {menuOpen &&(
    <ul className="menuBox">
    <ContextMenuItem>New Drawing</ContextMenuItem>
    <ContextMenuItem><a href="#">Open</a></ContextMenuItem>
    <ContextMenuItem><a href="#">View Gallery</a></ContextMenuItem>
    <ContextMenuItem><a href="#">Download</a></ContextMenuItem>
    <ContextMenuItem><a href="#">Share Drawing</a></ContextMenuItem>
    <ContextMenuItem><a href="#">Save Drawing</a></ContextMenuItem>
    </ul>
    )}
    
    </div>
 )
}
export default Menu;