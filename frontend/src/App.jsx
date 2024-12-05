import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery.jsx";
import PopupTest from "./pages/PopupTest.jsx";
import Layout from "./pages/Layout.jsx";
import NotFound from "./pages/NotFound.jsx";
import Editor from "./pages/Editor.jsx";
import Menu from "./components/Menu.jsx"
import ColorPickerToolbar from "./components/ColorPickerToolbar.jsx";
import ImageDetailsOverlay from "./components/GalleryPageComponents/ImageDetailsOverlay.jsx";

import './css/App.css';

const testingImages = [
  { id: 1, imgSrc: "https://imgcdn.stablediffusionweb.com/2024/9/5/24eaaa41-711b-4632-a86c-85a1067d52de.jpg" },
  { id: 2, imgSrc: "https://meuvalordigital.com.br/wp-content/uploads/2024/08/One-Piece-10-curiosidades-sobre-Monkey-D-Luffy.jpg" },
  { id: 3, imgSrc: "https://miro.medium.com/v2/resize:fit:736/1*YqfVlyCe06DfcPsR3kpYrw.jpeg" },
  { id: 4, imgSrc: "https://staticg.sportskeeda.com/editor/2023/07/35206-16893440521036-1920.jpg?w=640" },
  { id: 5, imgSrc: "https://i.pinimg.com/originals/b0/b6/29/b0b629922c3a95da5bc35921bcf2983c.jpg" },
  { id: 6, imgSrc: "https://beebom.com/wp-content/uploads/2024/05/gear-5-featured-new.jpg" },
];


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Gallery images={testingImages}/>} />
          <Route path="popuptest" element={<PopupTest />} />
          <Route path="menu" element={<Menu/>}/>
          <Route path="colorpicker" element={<ColorPickerToolbar/>}/>
          <Route path="*" element={<NotFound />}/>
        </Route>
        <Route path="/editor" element={<Editor />} />
        {/* Route for detail info overlay window of a image */}
        <Route path="/gallery/viewImage/:imageId" element={<ImageDetailsOverlay images={testingImages} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;