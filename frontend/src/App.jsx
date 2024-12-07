import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery.jsx";
import Layout from "./pages/Layout.jsx";
import NotFound from "./pages/NotFound.jsx";
import Editor from "./pages/Editor.jsx";
import Menu from "./components/Menu.jsx";
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
        {/* all other routes under layout have navbar */}
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={<Gallery images={testingImages} />}
          >
            <Route path="viewImage/:imageId" element={<ImageDetailsOverlay images={testingImages} />} />
          </Route>
          
          {/* 404 route for invalid page urls */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* editor page unaffected by layout element */}
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
