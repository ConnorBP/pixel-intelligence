import { useState } from "react";
import "../css/ShareImagePopup.css";

const ShareImagePopUp = ({ isOpen, onClose, onShare }) => {

  if (!isOpen) { return (<></>); }

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [canvasSize, setCanvasSize] = useState("16x16");

  const handleShare = () => {
    // call the share image callback
    onShare({ name, description, canvasSize });
    // then call the close window callback
    onClose();
  };

  const updatePreview = (size) => {
    setCanvasSize(size);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-title">Share Image</h3>
        <div className="popup-line"></div>
        <div className="popup-form">
          <label className="popup-label">What would you like to Share?</label>
          <input
            type="text"
            placeholder="What is the name of the image..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Describe what your image will be..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
          />
          <div className="popup-preview-wrapper">
            <div className="popup-preview">
              {/* <img src="" alt="Image Preview" className="popup-preview-image" /> */}
              <div alt="Preview" className="" />
            </div>
          
          </div>
          <div className="flex flex-end">
            <button onClick={onClose} className="button popup-button cancel-button">
              Cancel
            </button>
            <button onClick={handleShare} className="button popup-button create-button">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareImagePopUp;