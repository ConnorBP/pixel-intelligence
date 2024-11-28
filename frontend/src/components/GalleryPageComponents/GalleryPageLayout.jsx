import React from "react";
import { Link } from "react-router-dom";
import "../../css/GalleryPageCSS/Gallery.css";

// Component to render the gallery layout
// `images` prop is an array of image objects passed from the parent component
function GalleryPageLayout({ images }) {
    return (
        <div className="gallery_container">
            {/* Title centered at the top */}
            <h1 className="gallery_title">Gallery</h1>

            <div className="gallery">
                {images.map((data, index) => (
                    // Each image is wrapped in a Link for navigation to the detailed view overlay window
                    <div className="images" key={data.id}>
                        <Link to={`/gallery/viewImage/${data.id}`}>
                            <img src={data.imgSrc} alt={`Gallery Image ${data.id}`} style={{ width: "100%" }} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GalleryPageLayout;
