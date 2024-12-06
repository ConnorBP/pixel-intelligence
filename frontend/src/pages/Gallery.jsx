import React, { useState } from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";

// Main Gallery component that holds the gallery state
function Gallery({ images }) {
    const [galleryData, setGalleryData] = useState(images);

    return (
        <>
            {/* Pass images to GalleryPageLayout */}
            <GalleryPageLayout images={galleryData} />
        </>
    );
}

export default Gallery;
