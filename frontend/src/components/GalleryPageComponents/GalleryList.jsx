import { ImageItem } from "./ImageItem";
import "../../css/GalleryPageCSS/Gallery.css";

// Component to render the list of images
export const GalleryList = ({ images }) => {
    console.log(images);
    return (
        <div className="gallery">
            {images && images.length > 0 ? (
                images.map((image) => <ImageItem key={image._id} image={image} />)
            ) : (
                <p>No images available</p>
            )}
        </div>
    );
};
