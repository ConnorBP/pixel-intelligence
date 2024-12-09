import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePreserveQueryParamsNavigate } from "../../hooks/usePreserveQueryParamsNavigate";
import { useImageDetails } from "../../context/ImageDetailsContext";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { CiLink } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { IoIosDownload } from "react-icons/io";
import "../../css/GalleryPageCSS/ImageDetailsOverlay.css";

function ImageDetailsOverlay() {
    const { imageId } = useParams();
    const navigate = usePreserveQueryParamsNavigate();
    const [copied, setCopied] = useState(false);

    const { images, getImage } = useImageDetails();

    // Find the specific image details based on the `imageId`
    const image = getImage(imageId);
    console.log(`got image id ${imageId}: ${image} in map: `, images);

    if (!image) return (<div className="image_details">
        <CloseRoundedIcon onClick={() => navigate('/')} className="close_icon" />
        <div className="error">
            <p>Image {imageId} not found</p>
            {/* <ul>
                {[...images.keys()].map(k => (
                    <li key={k}>{images.get(k)._id}</li>
                ))}
            </ul> */}
        </div>
    </div>);

    // Copy the image link to the clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(cleanUrl(window.location.href));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Download the Image
    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = image.imgDataUrl;
        link.download = `image-${image.id}.jpg`;
        link.click();
    };

    const editImage = () => {
        navigate('/editor', { state: { image } });
    };

    function cleanUrl(url) {
        return url.split("?")[0].split("#")[0];
    }

    return (
        <div className="image_details">
            {/* Close button to navigate back to the gallery */}
            <CloseRoundedIcon onClick={() => navigate('/')} className="close_icon" />

            <div className="content">
                {/* Left side for the image */}
                <div className="image_section">
                    <img src={image.imgDataUrl} alt={image.name || `Image ${image.id}`} />
                </div>

                {/* Right side for the details */}
                <div className="details_section">
                    {/* Metadata Section */}
                    <h2>{image.name || "Untitled Image"}</h2>
                    <p><b>Description:</b> {image.description || "No description available."}</p>
                    <p><b>Creator:</b> {image.creator || "Unknown"}</p>
                    <p><b>Date Uploaded:</b> {new Date(image.creation_date).toLocaleString() || "Unknown"}</p>
                    {image.tags && (
                        <p><b>Tags:</b> {image.tags.join(", ")}</p>
                    )}

                    {/* Sharing Section */}
                    <p><b>Share:</b></p>
                    <div className="share_links">
                        <a href={`https://wa.me/?text=${encodeURIComponent("Check out this pixel art image! " + cleanUrl(window.location.href))}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon />
                        </a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${cleanUrl(window.location.href)}`} target="_blank" rel="noopener noreferrer">
                            <FacebookIcon />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent("Check out this pixel art image! " + cleanUrl(window.location.href))}`} target="_blank" rel="noopener noreferrer">
                            <TwitterIcon />
                        </a>
                        <div className="tooltip">
                            <button onClick={copyToClipboard}><CiLink /></button>
                            <span className={`tooltiptext ${copied ? 'show' : ''}`}>Copied!</span>
                        </div>
                        <button onClick={downloadImage}><IoIosDownload /></button>
                        <button onClick={editImage}><FaEdit /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageDetailsOverlay;
