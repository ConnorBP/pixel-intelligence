import { Outlet, Link } from "react-router-dom";

// this file wraps around each of the routes to provide a nav header

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/gallery">Home / Gallery</Link>
          </li>
          <li>
            <Link to="/editor">Editor</Link>
          </li>
          <li>
            <Link to="/popuptest">Test Popup Component</Link>
          </li>
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          <li>
            <Link to="/colorpicker">Color Picker</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;
