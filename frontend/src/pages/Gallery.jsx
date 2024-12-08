import React, { useEffect, useState } from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";
import { Outlet } from "react-router-dom";
import { getGallery } from "../api";
import { useSession } from "../context/SessionContext";
import { useImageDetails } from "../context/ImageDetailsContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { GeneratePng } from "../utils";

const galleryCacheInvalidationTime = 1000 * 60 * 2; // 2 minutes
// default values for keeping gallery data on the page
const defaultGalleryState = {
    page: 1,
    lastRefresh: 0,
    images: [],
};

// Main Gallery component that holds the gallery state
function Gallery() {

    const [galleryStateCache, setGalleryStateCache] = useLocalStorage('galleryState', defaultGalleryState);

    // track if we have connected to the api endpoint and received a session
    const { sessionLoaded, isSessionStillValid, refresh } = useSession();

    const {images, addImage} = useImageDetails();

    useEffect(() => {
        // load gallery data once a valid session is loaded
        if (sessionLoaded && galleryStateCache.lastRefresh < Date.now() - galleryCacheInvalidationTime) {
            // refresh the session before fetching gallery data
            if(!isSessionStillValid()){
                refresh();
                return;
            }
            console.log('loading gallery data');

            let page = defaultGalleryState != null ? defaultGalleryState.page : 1;

            getGallery(page).then((data) => {
                if (data) {
                    const dataWithImages = data.map((image) => {
                        return { ...image, imgDataUrl: GeneratePng(image) };
                    });
                    // update our localstorage cached gallery page state
                    setGalleryStateCache((oldState) => {
                        let newState = { ...oldState, page, images: dataWithImages, lastRefresh: Date.now() };
                        return newState;
                    });
                    // console.log('loaded: ', data);
                }
            });
        }
        if(galleryStateCache.images.length > 0){
            galleryStateCache.images.forEach((image) => {
                addImage(image);
            });
        }
    }, [sessionLoaded, galleryStateCache]);

    return (
        <>
            {/* show child route for image details in outlet */}
            <Outlet />
            {/* show the gallery page content here */}
            <GalleryPageLayout images={galleryStateCache.images} />
        </>
    );
}

export default Gallery;
