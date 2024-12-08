import { GalleryHeader } from "./GalleryHeader";
import { GalleryList } from "./GalleryList";
import GalleryPagination from "./GalleryPagination";
import "../../css/GalleryPageCSS/Gallery.css";

// Component to render the gallery layout
function GalleryPageLayout({ images }) {
    return (
        <div className="gallery_container">
            <GalleryHeader /> {/* The header with title and any additional UI */}
            <GalleryList images={images} /> {/* The list of images */}
            <GalleryPagination /> {/* The pagination controls component */}
        </div>
    );
}

export default GalleryPageLayout;
