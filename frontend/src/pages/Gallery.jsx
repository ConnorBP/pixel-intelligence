import React, { useState } from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";
import { Outlet } from "react-router-dom";

// Main Gallery component that holds the gallery state
function Gallery({ images }) {
    return (
        <>
            {/* show child route for image details in outlet */}
            <Outlet />
            {/* show the gallery page content here */}
            <GalleryPageLayout images={images} />
        </>
    );
}

export default Gallery;
