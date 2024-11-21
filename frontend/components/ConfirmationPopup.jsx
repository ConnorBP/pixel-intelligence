import './ConfirmationPopup.css'

// eslint-disable-next-line react/prop-types
function ConfirmationPopup({ isOpen, title, message1, message2,onCancel, onConfirm }) {
 
    if (!isOpen) return null; 

  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <p className="title">{title}</p>
        <p className="message1">{message1}</p>
        <p className="message2">{message2}</p>
        <div className='button'>
        <button onClick={onCancel} className="cancel-button">Cancel</button>
        <button onClick={onConfirm} className="confirm-button">Ok</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;
