import React, { useState } from "react";
import "./SaveImagePopup.css";

const SaveImagePopup = ({ onClose, onSave, previewImage }) => {
  const [imageName, setImageName] = useState("");

  const handleSave = () => {
    if (imageName.trim()) {
      onSave(imageName); 
      onClose();
    } else {
      alert("Please provide a name for your image.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-title">Save Image</h3>
        <div className="popup-line"></div>
        <div className="popup-form">
          <label className="popup-label">What would you like to name your image:</label>
          <input
            type="text"
            placeholder="Enter image title..."
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="input"
          />
          <div className="popup-preview-wrapper">
            <div className="popup-preview">
              {previewImage ? (
                <img src={previewImage} alt="Image Preview" className="popup-preview-image" />
              ) : (
                <span>No Preview</span>
              )}
            </div>
          </div>
          <div className="flex flex-end">
            <button onClick={onClose} className="button cancel-button">
              Cancel
            </button>
            <button onClick={handleSave} className="button create-button">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveImagePopup;