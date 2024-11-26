import {useState} from "react";
import { IoMdMenu } from "react-icons/io";
import '../css/Menu.css'
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
    <li><a href="#">New Drawing</a></li>
    <li><a href="#">Open</a></li>
    <li><a href="#">View Gallery</a></li>
    <li><a href="#">Download</a></li>
    <li><a href="#">Share Drawing</a></li>
    <li><a href="#">Save Drawing</a></li>
    </ul>
    )}
    
    </div>
 )
}
export default Menu;