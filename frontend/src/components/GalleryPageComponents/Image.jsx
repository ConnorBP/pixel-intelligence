import React from "react";
import "../../css/GalleryPageCSS/Image.css";

function Image({ src, alt }) {
    if (!src) {
        console.error("Image src is undefined!");
        return null;
    }

    return (
        <div className="gallery_image">
            <img src={src} alt={alt || "Gallery image"} />
        </div>
    );
}

export default Image;
