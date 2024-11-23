import { useState, useEffect } from "react";
import Section from "../components/Section.jsx";
import NewImagePopup from "../components/NewImagePopup.jsx"; // Import the popup component
import "../css/Gallery.css";

function Gallery() {
    const [galleryData, setGalleryData] = useState([]);
    const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility

    // Hardcoded images for testing
    useEffect(() => {
        const testGalleryData = [
            {
                month: "November 2024",
                images: [
                    "https://via.placeholder.com/150?text=Image1",
                    "https://via.placeholder.com/150?text=Image2",
                ],
            },
            {
                month: "December 2024",
                images: [
                    "https://via.placeholder.com/150?text=Image3",
                    "https://via.placeholder.com/150?text=Image4",
                ],
            },
        ];
        setGalleryData(testGalleryData);
    }, []);

    // Function to handle new image creation
    const handleCreateNewImage = (newImage) => {
        const updatedGalleryData = [...galleryData];
        if (updatedGalleryData.length > 0) {
            // Add new image to the latest month's section
            updatedGalleryData[0].images.push(newImage);
        } else {
            // Create a new section if no data exists
            updatedGalleryData.push({
                month: "New Month",
                images: [newImage],
            });
        }
        setGalleryData(updatedGalleryData);
    };

    return (
        <div className="gallery_container">
            <h1>Creations Gallery</h1>
            <button className="create_button" onClick={() => setShowPopup(true)}>
                Create New Image
            </button>
            {galleryData.map((data, index) => (
                <Section key={index} month={data.month} images={data.images} />
            ))}

            {/* Render the popup when the button is clicked */}
            {showPopup && (
                <NewImagePopup
                    onClose={() => setShowPopup(false)} // Close the popup
                    onCreate={(newImage) => {
                        handleCreateNewImage(newImage); // Add the new image
                        setShowPopup(false); // Close the popup after creation
                    }}
                />
            )}
        </div>
    );
}

export default Gallery;
