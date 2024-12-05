// GalleryList.jsx

import React from "react";
import PropTypes from "prop-types";
import { ImageItem } from "./ImageItem";
import "../../css/GalleryPageCSS/Gallery.css";

const GalleryList = ({ images }) => {
    return (
        <section className="gallery">
            {images && images.length > 0 ? (
                images.map((image) => (
                    <ImageItem key={image.id} image={image} />
                ))
            ) : (
                <p>No images available</p>
            )}
        </section>
    );
};

GalleryList.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            imgSrc: PropTypes.string.isRequired,
        })
    ),
};

GalleryList.defaultProps = {
    images: [],
};

export default GalleryList;  // Default export
