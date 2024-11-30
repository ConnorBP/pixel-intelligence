import { useState, useEffect } from "react";
import GalleryPageLayout from "../components/GalleryPageComponents/GalleryPageLayout";

function Gallery() {
    const [galleryData, setGalleryData] = useState([]);

    // Hardcoded images for testing
    useEffect(() => {
        const testGalleryData = [
            {
                month: "November 2024",
                images: [
                    "https://via.placeholder.com/150?text=Image1",
                    "https://via.placeholder.com/150?text=Image2",
                ],
            },
            {
                month: "December 2024",
                images: [
                    "https://via.placeholder.com/150?text=Image3",
                    "https://via.placeholder.com/150?text=Image4",
                ],
            },
        ];
        setGalleryData(testGalleryData);
    }, []);


function Gallery({ images }) {
    return (
        <>
            <GalleryPageLayout images={images} />
        </>
    );
}

export default Gallery;
