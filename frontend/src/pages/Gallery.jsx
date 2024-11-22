import { useState, useEffect } from "react";
import Section from "../components/Section.jsx";
// import "../../css/Gallery.css";

function Gallery() {
    const [galleryData, setGalleryData] = useState([]);

    // Hard Coded Images for testing
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

    return (
        <div className="gallery_container">
            <h1>Your Gallery</h1>
            {galleryData.map((data, index) => (
                <Section key={index} month={data.month} images={data.images} />
            ))}
        </div>
    );
}

export default Gallery;
