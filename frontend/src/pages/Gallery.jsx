import React from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";

function Gallery({ images }) {
    return (
        <>
            <GalleryPageLayout images={images} />
        </>
    );
}

export default Gallery;
