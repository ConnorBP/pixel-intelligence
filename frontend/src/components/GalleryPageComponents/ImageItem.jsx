import React from "react";
import { Link } from "react-router-dom";

export const ImageItem = ({ image }) => {
    return (
        <div className="images">
            <Link to={`/viewImage/${image.id}`}>
                <img src={image.imgSrc} alt={`Gallery Image ${image.id}`} style={{ width: "100%" }} />
            </Link>
        </div>
    );
};
