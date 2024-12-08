import React, { useEffect, useState } from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";
import { Outlet } from "react-router-dom";
import { getGallery } from "../api";
import { useSession } from "../context/SessionContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

const defaultGalleryState = {
    page: 0,
    lastRefresh: Date.now(),
    images: [],
};

// Main Gallery component that holds the gallery state
function Gallery({ images }) {

    const [imageList, setImageList] = useState(null);

    const [galleryStateCache, setGalleryStateCache] = useLocalStorage('galleryState', defaultGalleryState);

    // track if we have connected to the api endpoint and received a session
    const { sessionLoaded } = useSession();

    useEffect(() => {
        // load gallery data once session is loaded initially
        if (sessionLoaded && imageList === null) {
            getGallery().then((data) => {
                if (data) {
                    setImageList(data);
                    console.log('loaded: ', data);
                }
            });
        }
    }, [sessionLoaded]);

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
