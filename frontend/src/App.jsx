import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery.jsx";
import PopupTest from "./pages/PopupTest.jsx";
import Layout from "./pages/Layout.jsx";
import Editor from "./pages/Editor.jsx";
import Menu from "./components/Menu.jsx"
import './css/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Gallery />} />
          <Route path="popuptest" element={<PopupTest />} />
          <Route path="menu" element={<Menu />} />
        </Route>
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;