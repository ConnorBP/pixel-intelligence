import { useState } from 'react';
import ConfirmationPopup from '../components/ConfirmationPopup.jsx'

// strictly for demonstration purposes during development

const PopupTest = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      <button onClick={handleOpenPopup}>Test Popup</button>
      <ConfirmationPopup
        isOpen={isPopupOpen}
        title="Title of Message Box"
        message1="This action cannot be undone."
        message2="Continue anyways?"
        onCancel={handleClosePopup}
        onConfirm={() => {
          console.log("Confirmed!");
          handleClosePopup();
        }}
      />
    </div>
  );
};

export default PopupTest;
