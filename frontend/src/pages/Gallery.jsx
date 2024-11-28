import React from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";
import ImageDetailsOverlay from "../components/GalleryPageComponents/ImageDetailsOverlay";;
import { Routes, Route } from "react-router-dom";

const testData = [
    { id: 1, imgSrc: "https://imgcdn.stablediffusionweb.com/2024/9/5/24eaaa41-711b-4632-a86c-85a1067d52de.jpg" },
    { id: 2, imgSrc: "https://meuvalordigital.com.br/wp-content/uploads/2024/08/One-Piece-10-curiosidades-sobre-Monkey-D-Luffy.jpg" },
    { id: 3, imgSrc: "https://miro.medium.com/v2/resize:fit:736/1*YqfVlyCe06DfcPsR3kpYrw.jpeg" },
    { id: 4, imgSrc: "https://staticg.sportskeeda.com/editor/2023/07/35206-16893440521036-1920.jpg?w=640" },
    { id: 5, imgSrc: "https://i.pinimg.com/originals/b0/b6/29/b0b629922c3a95da5bc35921bcf2983c.jpg" },
    { id: 6, imgSrc: "https://beebom.com/wp-content/uploads/2024/05/gear-5-featured-new.jpg" },
];

function Gallery() {
    return (
        <Routes>
            <Route path="/" element={<GalleryPageLayout images={testData} />} />
            <Route path="viewImage/:imageId" element={<ImageDetailsOverlay images={testData} />} />
        </Routes>
    );
}

export default Gallery;
