import { useState, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import "../css/NewImagePopup.css";
// import popUpTabHadler from "../hooks/popUpTabHandler";

const NewImagePopup = ({ isOpen, onClose, onCreate }) => {
  if (!isOpen) {
    return <></>;
  }

  const [description, setDescription] = useState("");
  const [canvasSize, setCanvasSize] = useState(64);

  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const tabPopupRef = useRef(null);
  // popUpTabHadler({ tabPopupRef, isOpen: onCreate, onClose })

  const handleCreate = async () => {
    // call the create image callback
    if (waitingForResponse) {
      return false;
    }
    setWaitingForResponse(true);
    await onCreate({ description, canvasSize });
    setWaitingForResponse(false);
    // the caller is responsible for closing the popup
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box" ref={tabPopupRef} tabIndex={-1}>
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
            <button
              onClick={onClose}
              disabled={waitingForResponse}
              className="button popup-button cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={waitingForResponse}
              className="button popup-button create-button"
            >
              {waitingForResponse ? (
                <ThreeDots color="var(--text-color)" height="100%" />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewImagePopup;
