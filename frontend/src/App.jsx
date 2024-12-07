import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery.jsx";
import PopupTest from "./pages/PopupTest.jsx";
import Layout from "./pages/Layout.jsx";
import NotFound from "./pages/NotFound.jsx";
import Editor from "./pages/Editor.jsx";
import Menu from "./components/Menu.jsx";
import ColorPickerToolbar from "./components/ColorPickerToolbar.jsx";
import ImageDetailsOverlay from "./components/GalleryPageComponents/ImageDetailsOverlay.jsx";

import './css/App.css';

const baseUrl = '/test_images';

const testingImages = Array.from({ length: 27 }, (_, i) => {
  const imgSrc = `${baseUrl}/testimg${i + 1}.png`;
  return { id: i + 1, imgSrc };
});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Gallery images={testingImages} />} />
          <Route path="popuptest" element={<PopupTest />} />
          <Route path="menu" element={<Menu />} />
          <Route path="colorpicker" element={<ColorPickerToolbar />} />
          {/* Move ViewImage route inside Layout */}
          <Route path="viewImage/:imageId" element={<ImageDetailsOverlay images={testingImages} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
