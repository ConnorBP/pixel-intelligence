import React from "react";
import Image from "./Image";
import "../../css/GalleryPageCSS/Section.css";

function Section({ month, images }) {
    return (
        <div className="gallery_section">
            <h2>{month}</h2>
            <div className="gallery_grid">
                {images.map((image, index) => (
                    <Image key={index} src={image} alt={`Generated in ${month}`} />
                ))}
            </div>
        </div>
    );
}

export default Section;