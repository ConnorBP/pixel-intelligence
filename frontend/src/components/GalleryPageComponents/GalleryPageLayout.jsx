import { GalleryHeader } from "./GalleryHeader";
import { GalleryList } from "./GalleryList";
import GalleryPagination from "./GalleryPagination";
import "../../css/GalleryPageCSS/Gallery.css";

// Component to render the gallery layout
function GalleryPageLayout({ images, currentPage, totalPages, onPageSelected }) {
    return (
        <div className="gallery_container">
            <GalleryHeader pageNumber={currentPage} totalPages={totalPages} /> {/* The header with title and any additional UI */}
            <GalleryList images={images} /> {/* The list of images */}
            <GalleryPagination currentPage={currentPage} onPageSelected={onPageSelected} /> {/* The pagination controls component */}
        </div>
    );
}

export default GalleryPageLayout;
