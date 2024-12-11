import { useState, useRef } from "react";
import "../css/ShareImagePopup.css";
import popUpTabHadler from "../hooks/popUpTabHandler";
const ShareImagePopUp = ({ isOpen, onClose, onShare }) => {
  const tabPopupRef = useRef(null);
  popUpTabHadler({ tabPopupRef, isOpen, onClose })
  if (!isOpen) { return (<></>); }

  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");


  const handleShare = () => {
    // call the share image callback
    onShare({ name, description, author });
    // the caller is responsible for closing the popup
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box" ref={tabPopupRef} tabIndex={-1}>
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
            maxLength={32}
          />
          <input
            type="text"
            placeholder="Describe your image..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            maxLength={255}
          />
          <input
            type="text"
            placeholder="What is your name?"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input"
            maxLength={32}
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