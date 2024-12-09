import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useImageDetails } from "../../context/ImageDetailsContext";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import "../../css/GalleryPageCSS/ImageDetailsOverlay.css";

function ImageDetailsOverlay() {
    const { imageId } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const { images, getImage } = useImageDetails();

    // Find the specific image details based on the `imageId`
    const image = getImage(imageId);
    console.log(`got image id ${imageId}: ${image} in map: `, images);

    if (!image) return (<div className="image_details">
        <CloseRoundedIcon onClick={() => navigate(-1)} className="close_icon" />
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
        navigator.clipboard.writeText(image.imgDataUrl);
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

    return (
        <div className="image_details">
            {/* Close button to navigate back to the gallery */}
            <CloseRoundedIcon onClick={() => navigate(-1)} className="close_icon" />

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
                        <a href={`https://wa.me/?text=${encodeURIComponent(image.imgDataUrl)}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon />
                        </a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${image.imgDataUrl}`} target="_blank" rel="noopener noreferrer">
                            <FacebookIcon />
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${image.imgDataUrl}`} target="_blank" rel="noopener noreferrer">
                            <TwitterIcon />
                        </a>
                        <button onClick={copyToClipboard}>{copied ? "Copied!" : "Copy URL"}</button>
                        <button onClick={downloadImage}>Download</button>
                        <button onClick={editImage}>Edit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageDetailsOverlay;
