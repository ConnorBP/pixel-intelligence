import React, { useEffect, useState } from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";
import { Outlet } from "react-router-dom";
import { getGallery } from "../api";
import { useSession } from "../context/SessionContext";
import { useImageDetails } from "../context/ImageDetailsContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { GeneratePng } from "../utils";

const galleryCacheInvalidationTime = 1000 * 30; // 30 seconds
// default values for keeping gallery data on the page
const defaultGalleryState = {
    page: 1,
    lastRefresh: 0,
    images: [],
};

// Main Gallery component that holds the gallery state
function Gallery() {

    // gallery state cache in localstorage
    const [galleryStateCache, setGalleryStateCache] = useLocalStorage('galleryState', defaultGalleryState);

    // pagination state
    // How many images to display per page. This won't change for now, but could be made dynamic in the future.
    const [listingsPerPage, setListingsPerPage] = useState(12);
    // track last selected page so we can detect page changes
    const [lastSelectedPage, setLastSelectedPage] = useState(galleryStateCache.page);

    // track if we have connected to the api endpoint and received a session
    const { sessionLoaded, isSessionStillValid, refresh } = useSession();

    const { images, addImage } = useImageDetails();

    const onPageSelected = (page) => {
        console.log('page selected: ', page);
        setGalleryStateCache((oldState) => {
            let newState = { ...oldState, page };
            return newState;
        });
    };

    useEffect(() => {
        // load gallery data once a valid session is loaded
        // and:( the page has changed or the cache is stale)
        if (
            sessionLoaded &&
            (
                lastSelectedPage != galleryStateCache.page
                || galleryStateCache.lastRefresh < Date.now() - galleryCacheInvalidationTime
            )
        ) {
            // refresh the session before fetching gallery data
            if (!isSessionStillValid()) {
                refresh();
                return;
            }
            console.log('loading gallery data');

            let page = galleryStateCache != null ? galleryStateCache.page : 1;

            setLastSelectedPage(page);

            getGallery(page, listingsPerPage).then((data) => {
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
        if (galleryStateCache.images.length > 0) {
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
            <GalleryPageLayout images={galleryStateCache.images} currentPage={galleryStateCache.page} onPageSelected={onPageSelected} />
        </>
    );
}

export default Gallery;
