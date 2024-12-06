import React from "react";
import { Link } from "react-router-dom";

export const ImageItem = ({ image }) => {
    return (
        <div className="images">
            <Link to={`/gallery/viewImage/${image.id}`}>
                <img src={image.imgSrc} alt={`Gallery Image ${image.id}`} style={{ width: "100%" }} />
            </Link>
            <Link to={`/gallery/details/${image.id}`} className="details_button">
                More Details
            </Link>
        </div>
    );
};
