import { useState } from 'react';
import ConfirmationPopup from '../components/ConfirmationPopup.jsx'

// strictly for demonstration purposes during development

const PopupTest = () => {
  const [popupData, setPopupData] = useState(false);

  const handleOpenPopup = () => {
    setPopupData({
      title: "Title of Message Box",
      message1: "This action cannot be undone.",
      message2: "Continue anyways?",
      onCancel: handleClosePopup,
      onConfirm: () => { console.log("Confirmed!"); handleClosePopup(); }
    });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(null);
  };

  return (
    <div>
      <button onClick={handleOpenPopup}>Test Popup</button>
      <ConfirmationPopup
        popupData={popupData}
      />
    </div>
  );
};

export default PopupTest;
