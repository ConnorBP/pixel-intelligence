import React from "react";

// Header component for the gallery page
export const GalleryHeader = ({ pageNumber, totalPages }) => {

    const subHeading = pageNumber ? <p>Page {pageNumber} {totalPages ? ` of ${totalPages}` : ''}</p> : <></>;

    return (
        <header className="gallery_header">
            <h1 className="gallery_title">Gallery</h1>
            {subHeading}
        </header>
    );
};
