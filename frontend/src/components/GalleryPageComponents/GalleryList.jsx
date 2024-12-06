import { ImageItem } from "./ImageItem";
import "../../css/GalleryPageCSS/Gallery.css";

// Component to render the list of images
export const GalleryList = ({ images }) => {
    return (
        <div className="gallery">
            {images && images.length > 0 ? (
                images.map((image) => <ImageItem key={image.id} image={image} />)
            ) : (
                <p>No images available</p>
            )}
        </div>
    );
};
