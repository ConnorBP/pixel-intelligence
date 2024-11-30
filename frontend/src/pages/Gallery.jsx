import { useState, useEffect } from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";

function Gallery({ images }) {
    const [galleryData, setGalleryData] = useState(images);

    return (
        <>
            <GalleryPageLayout images={galleryData} />
        </>
    );
}

export default Gallery;
