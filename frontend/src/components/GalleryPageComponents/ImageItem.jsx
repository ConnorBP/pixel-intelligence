import React from "react";
import { Link } from "react-router-dom";

// Component to render an individual image item
export const ImageItem = ({ image }) => {
    return (
        <div className="image_item">
            {/* Link to view the image overlay */}
            <Link to={`/gallery/viewImage/${image.id}`}>
                <img src={image.imgSrc} alt={`Gallery Image ${image.id}`} style={{ width: "100%" }} />
            </Link>
            
            {/* Link to the "More Details" page */}
            <Link to={`/gallery/viewDetails/${image.id}`} className="details_link">
                More Details
            </Link>
        </div>
    );
};
