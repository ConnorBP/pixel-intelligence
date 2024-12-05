import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/GalleryPageCSS/GalleryItemDetails.css"; // Create a CSS file for styling

const GalleryItemDetails = ({ galleryItems }) => {
    const { itemId } = useParams(); // Get the item ID from the route
    const navigate = useNavigate(); // For navigating back

    // Find the specific gallery item using the `itemId`
    const galleryItem = galleryItems.find((item) => item.id === parseInt(itemId));

    if (!galleryItem) {
        return <div className="error">Gallery item not found.</div>;
    }

    return (
        <div className="gallery_item_details">
            {/* Header with a Back button */}
            <button className="back_button" onClick={() => navigate(-1)}>
                &larr; Back to Gallery
            </button>

            <div className="details_content">
                {/* Main image */}
                <div className="image_section">
                    <img
                        src={galleryItem.imgSrc}
                        alt={galleryItem.title}
                        className="main_image"
                    />
                </div>

                {/* Details section */}
                <div className="info_section">
                    <h1>{galleryItem.title}</h1>
                    <p>{galleryItem.description}</p>

                    {/* Metadata or additional info */}
                    <ul className="metadata">
                        <li><b>Category:</b> {galleryItem.category}</li>
                        <li><b>Uploaded by:</b> {galleryItem.uploader}</li>
                        <li><b>Date:</b> {galleryItem.date}</li>
                    </ul>

                    {/* Actions */}
                    <div className="actions">
                        <button onClick={() => alert("Like functionality coming soon!")}>
                            Like
                        </button>
                        <button onClick={() => alert("Bookmark functionality coming soon!")}>
                            Bookmark
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryItemDetails;
