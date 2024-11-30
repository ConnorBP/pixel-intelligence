import '../css/ConfirmationPopup.css'

function ConfirmationPopup({ isOpen, title, message1, message2,onCancel, onConfirm }) {
 
    if (!isOpen) return null; 

  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <p className="title">{title}</p>
        <p className="message1">{message1}</p>
        <p className="message2">{message2}</p>
        <div className='popup-button-container'>
          <button onClick={onCancel} className="popup-button cancel-button">Cancel</button>
          <button onClick={onConfirm} className="popup-button confirm-button">Ok</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;
