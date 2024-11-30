import { Link } from "react-router-dom";
import "../../css/GalleryPageCSS/Gallery.css";

// Component to render the gallery layout
// `images` prop is an array of image objects passed from the parent component
function GalleryPageLayout({ images }) {
    return (
        <div className="gallery_container">
            {/* Title centered at the top */}
            <h1 className="gallery_title">Gallery</h1>
            {!images || images.length === 0 ? (
                <p>No images available</p>
            ) : (
                <div className="gallery">
                    {images.map((image, index) => (
                        // Each image is wrapped in a Link for navigation to the detailed view overlay window
                        <div className="images" key={index}>
                            <Link to={`/gallery/viewImage/${image.id}`}>
                                <img src={image.imgSrc} alt={`Gallery Image ${image.id}`} style={{ width: "100%" }} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


export default GalleryPageLayout;
