import React, { useEffect, useState } from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";
import { Outlet } from "react-router-dom";
import { getGallery } from "../api";
import { useSession } from "../context/SessionContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

const defaultGalleryState = {
    page: 1,
    lastRefresh: Date.now(),
    images: [],
};

// Main Gallery component that holds the gallery state
function Gallery({ images }) {

    const [galleryStateCache, setGalleryStateCache] = useLocalStorage('galleryState', defaultGalleryState);

    // track if we have connected to the api endpoint and received a session
    const { sessionLoaded } = useSession();

    useEffect(() => {
        // load gallery data once a valid session is loaded
        if (sessionLoaded) {

            let page = defaultGalleryState != null ? defaultGalleryState.page : 1;

            getGallery(page).then((data) => {
                if (data) {

                    // update our localstorage cached gallery page state
                    setGalleryStateCache((oldState) => {
                        let newState = { ...oldState, page, images: data, lastRefresh: Date.now() };
                        return newState;
                    });
                    // console.log('loaded: ', data);
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
