import React, { useState } from "react";
import "../css/NewImagePopup.css";
import image from "../assets/image.png";

const NewImagePopup = ({ onClose, onCreate }) => {
  const [description, setDescription] = useState("");
  const [canvasSize, setCanvasSize] = useState("16x16");

  const handleCreate = () => {
    if (description.trim()) {
      onCreate({ description, canvasSize });
      onClose();
    }
  };

  const updatePreview = (size) => {
    setCanvasSize(size);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-title">New Image</h3>
        <div className="popup-line"></div>
        <div className="popup-form">
          <label className="popup-label">What would you like to draw?</label>
          <input
            type="text"
            placeholder="Describe what your image will be..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="popup-input"
          />
          <div className="popup-preview-wrapper">
            <div className="popup-preview">
              <img src={image} alt="Preview" className="popup-preview-image" />
            </div>
            <div className="popup-canvas-size">
              <label className="popup-label">Canvas Size:</label>
              <select
                value={canvasSize}
                onChange={(e) => updatePreview(e.target.value)}
                className="popup-select"
              >
                <option value="16x16">16x16</option>
                <option value="32x32">32x32</option>
                <option value="64x64">64x64</option>
              </select>
            </div>
          </div>
          <div className="popup-buttons">
            <button onClick={onClose} className="popup-button cancel-button">
              Cancel
            </button>
            <button onClick={handleCreate} className="popup-button create-button">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewImagePopup;
