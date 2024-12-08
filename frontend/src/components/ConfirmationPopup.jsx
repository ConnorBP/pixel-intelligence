import React from 'react';
import PropTypes from 'prop-types';
import '../css/ConfirmationPopup.css'

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

function ConfirmationPopup({ popupData }) {
  if (!popupData) return <></>;

  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <p className="title">{popupData.title}</p>
        <p className="message1">{popupData.message1}</p>
        <p className="message2">{popupData.message2}</p>
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
