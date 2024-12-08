import React from "react";

// Header component for the gallery page
export const GalleryHeader = ({ pageNumber, maxPages }) => {

    const subHeading = pageNumber ? <p>Page {pageNumber} {maxPages ? ` of ${maxPages}` : ''}</p> : <></>;

    return (
        <header className="gallery_header">
            <h1 className="gallery_title">Gallery</h1>
            {subHeading}
        </header>
    );
};
