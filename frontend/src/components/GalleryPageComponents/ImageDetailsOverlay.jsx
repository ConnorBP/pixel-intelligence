import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import "../../css/GalleryPageCSS/ImageDetailsOverlay.css";

function ImageDetailsOverlay({ images }) {
    const { imageId } = useParams(); // Extracting the `imageId` from the route parameters
    const navigate = useNavigate(); // Navigation hook for programmatic navigation
    const [copied, setCopied] = useState(false); // State to manage the "Copied" status for the URL
    const image = images.find((img) => img.id === parseInt(imageId)); // Finding the specific image based on the `imageId`

    if (!image) return <div>Image not found</div>; // If no matching image is found, display a fallback message

    const copyToClipboard = () => {
        navigator.clipboard.writeText(image.imgSrc);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = image.imgSrc;
        link.download = `image-${image.id}.jpg`; // Filename for the download
        link.click();
    };

    return (
        <div className="image_details">
            {/* Close button to navigate back to the gallery */}
            <CloseRoundedIcon onClick={() => navigate(-1)} className="close_icon" />
            <div className="content">
                {/* Left side for the image */}
                <div className="image_section">
                    <img src={image.imgSrc} alt={`Image ${image.id}`} />
                </div>

                {/* Right side for the details */}
                <div className="details_section">
                    <p><b>Image URL:</b></p>
                    <input type="text" value={image.imgSrc} readOnly />
                    <button onClick={copyToClipboard}>{copied ? "Copied!" : "Copy URL"}</button>

                    <p><b>Share:</b></p>
                    <div className="share_links">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(image.imgSrc)}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon />
                        </a>
                        {/* <a href={`https://www.facebook.com/sharer/sharer.php?u=${image.imgSrc}`} target="_blank" rel="noopener noreferrer">
                            <FacebookIcon />
                        </a> */}
                        <a href={`https://twitter.com/intent/tweet?url=${image.imgSrc}`} target="_blank" rel="noopener noreferrer">
                            <TwitterIcon />
                        </a>
                    </div>

                    <button className="download_btn" onClick={downloadImage}>
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageDetailsOverlay;
