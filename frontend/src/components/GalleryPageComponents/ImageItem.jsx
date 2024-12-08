import React from "react";
import { Link } from "react-router-dom";

export const ImageItem = ({ image }) => {
    return (
        <div className="images">
            <Link to={`/viewImage/${image._id}`}>
                <img className="" src={image.imgDataUrl} alt={`Gallery Image ${image.name}`} style={{ width: "100%" }} />
            </Link>
        </div>
    );
};
