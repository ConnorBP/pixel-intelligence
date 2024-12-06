import { Link } from "react-router-dom";

// Component to render an individual image item
export const ImageItem = ({ image }) => {
    return (
        <div className="images">
            <Link to={`/gallery/viewImage/${image.id}`}>
                <img src={image.imgSrc} alt={`Gallery Image ${image.id}`} style={{ width: "100%" }} />
            </Link>
        </div>
    );
};
