import PropTypes from 'prop-types';
import '../css/ConfirmationPopup.css'
import { useRef } from "react";
// import popUpTabHadler from "../hooks/popUpTabHandler";
// pass into popup a structure like this:
// {
//   title,
//   message1,
//   message2,
//   onCancel, // callback function
//   onConfirm // callback function
// }

// if null is passed instead, then the confirmation popup will be hidden.
// This way one popup may be used by multiple components or for different messages in the same file.
// remember to always set the popup to null in your callbacks to hide it.

function ConfirmationPopup({ popupData, children }) {
  // hook must never be conditional

  if (!popupData) return null;

  const tabPopupRef = useRef(null);
  // popUpTabHadler({ tabPopupRef, isOpen: popupData.onConfirm, onClose: popupData.onCancel})

  let extraContent;

  if (popupData.imageSrc && popupData.extraContent) {
    extraContent = (
      <>
        <div className="popup-preview">
          <img src={popupData.imageSrc} alt="Image Preview" className="popup-preview-image popup-image" />
          <div alt="Preview" className="" />
        </div>
      </>
    );
  } else if(popupData.imageSrc) {
    extraContent = (
      <>
          <img src={popupData.imageSrc} alt="Image Preview" className="popup-preview-image popup-image" />
      </>
    );
  } else {
    extraContent = popupData.extraContent;
  }

  return (
    <div className="alert-overlay">
      <div className="alert-box" ref={tabPopupRef} tabIndex={-1} >
        <p className="title">{popupData.title}</p>
        <p className="message1">{popupData.message1}</p>
        <p className="message2">{popupData.message2}</p>

        {/* allow the popup caller to insert additional components */}
        {extraContent ? extraContent : ''}

        {/* allow any additional content to be added as a child well */}
        {children}
        <div className='popup-button-container'>
          <button onClick={popupData.onCancel} className="popup-button cancel-button">Cancel</button>
          <button onClick={popupData.onConfirm} className="popup-button confirm-button">Ok</button>
        </div>
      </div>
    </div>
  );
}

ConfirmationPopup.propTypes = {
  popupData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message1: PropTypes.string.isRequired,
    message2: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  })
};

export default ConfirmationPopup;
