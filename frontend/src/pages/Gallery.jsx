import React, { useEffect, useState } from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
    // show 5 pages until this is set on server request
    const [totalPages, setTotalPages] = useState(5);

    // get the currently requested page from the search params
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchPage = parseInt(searchParams.get('page')) || 1;
    const navigate = useNavigate();

    // track if we have connected to the api endpoint and received a session
    const { sessionLoaded, isSessionStillValid, refresh } = useSession();

    const { images, addImage } = useImageDetails();

    const onPageSelected = (page) => {
        // console.log('page selected: ', page);
        navigate(`?page=${page}`);
    };

    useEffect(() => {
        let newPage = parseInt(searchPage) || 1;
        // console.log(`${newPage} ${galleryStateCache.page} ${galleryStateCache.lastRefresh} ${Date.now() - galleryCacheInvalidationTime}`);
        
        // load gallery data once a valid session is loaded
        // and:( the page has changed or the cache is stale)
        if (
            sessionLoaded &&
            (
                newPage != galleryStateCache.page
                || galleryStateCache.lastRefresh < Date.now() - galleryCacheInvalidationTime
            )
        ) {
            // refresh the session before fetching gallery data
            if (!isSessionStillValid()) {
                refresh();
                return;
            }
            console.log('loading gallery data');

            getGallery(newPage, listingsPerPage).then((data) => {
                // console.log('received gallery info: ', data);
                if(data && data.totalPages && data.totalPages > 0) {
                    setTotalPages(data.totalPages);
                }
                if (data && data.results && data.results.length > 0) {
                    
                    const dataWithImages = data.results.map((image) => {
                        return { ...image, imgDataUrl: GeneratePng(image) };
                    });
                    // update our localstorage cached gallery page state
                    setGalleryStateCache((oldState) => {
                        let newState = { ...oldState, page: newPage, images: dataWithImages, lastRefresh: Date.now() };
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
    }, [sessionLoaded, galleryStateCache, searchPage, navigate]);

    return (
        <>
            {/* show child route for image details in outlet */}
            <Outlet />
            {/* show the gallery page content here */}
            <GalleryPageLayout images={galleryStateCache.images} currentPage={galleryStateCache.page} onPageSelected={onPageSelected} totalPages={totalPages} />
        </>
    );
}

export default Gallery;
