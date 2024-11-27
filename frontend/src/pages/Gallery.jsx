import { useState, useEffect } from "react";
import Section from "../components/GalleryPageComponents/Section";
import "../css/GalleryPageCSS/Gallery.css";

function Gallery() {
    const [galleryData, setGalleryData] = useState([]);

    // Hard Coded Images for testing
    useEffect(() => {
        const testGalleryData = [
            {
                month: "December 2024",
                images: [
                    "https://via.placeholder.com/150?text=Image1",
                    "https://via.placeholder.com/150?text=Image2",
                    "https://via.placeholder.com/150?text=Image3",
                    "https://via.placeholder.com/150?text=Image4",
                    "https://via.placeholder.com/150?text=Image5",
                    "https://via.placeholder.com/150?text=Image6",
                    "https://via.placeholder.com/150?text=Image7",
                    "https://via.placeholder.com/150?text=Image8",
                ],
            },
            {
                month: "November 2024",
                images: [
                    "https://via.placeholder.com/150?text=Image1",
                    "https://via.placeholder.com/150?text=Image2",
                    "https://via.placeholder.com/150?text=Image3",
                    "https://via.placeholder.com/150?text=Image4",
                    "https://via.placeholder.com/150?text=Image5",
                    "https://via.placeholder.com/150?text=Image6",
                    "https://via.placeholder.com/150?text=Image7",
                    "https://via.placeholder.com/150?text=Image8",
                ],
            }
        ];
        setGalleryData(testGalleryData);
    }, []);

    return (
        <div className="gallery_container">
            <h1>Creations Gallery</h1>
            {galleryData.map((data, index) => (
                <Section key={index} month={data.month} images={data.images} />
            ))}
        </div>
    );
}

export default Gallery;