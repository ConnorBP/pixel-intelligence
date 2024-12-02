import { Outlet, Link } from "react-router-dom";

// this file wraps around each of the routes to provide a nav header

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Gallery</Link>
          </li>
          <li>
            <Link to="/editor">Editor</Link>
          </li>
        </ul>
      </nav>
      <Outlet /> {/* the actual page goes in place of outlet */}
    </>
  )
};

export default Layout;
