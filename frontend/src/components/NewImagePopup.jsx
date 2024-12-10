import { useState } from "react";
import "../css/NewImagePopup.css";

const NewImagePopup = ({ isOpen, onClose, onCreate }) => {

  if (!isOpen) { return (<></>); }

  const [description, setDescription] = useState("");
  const [canvasSize, setCanvasSize] = useState(64);

  const handleCreate = () => {
    // call the create image callback
    onCreate({ description, canvasSize });
    // the caller is responsible for closing the popup
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
            className="input"
          />
          <div className="popup-preview-wrapper">
            <div className="popup-preview">
              {/* <img src="" alt="Image Preview" className="popup-preview-image" /> */}
              <div alt="Preview" className="" />
            </div>
            <div className="popup-canvas-size">
              <label className="popup-label">Canvas Size:</label>
              <select
                value={canvasSize}
                onChange={(e) => setCanvasSize(e.target.value)}
                className="select"
              >
                <option value={8}>08x08</option>
                <option value={16}>16x16</option>
                <option value={32}>32x32</option>
                <option value={64}>64x64</option>
              </select>
            </div>
          </div>
          <div className="flex flex-end">
            <button onClick={onClose} className="button popup-button cancel-button">
              Cancel
            </button>
            <button onClick={handleCreate} className="button popup-button create-button">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewImagePopup;