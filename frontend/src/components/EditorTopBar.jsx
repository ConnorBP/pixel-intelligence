import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NewImagePopup from "../components/NewImagePopup";
import '../css/EditorPageCSS/EditorTopBar.css';

const EditorTopBar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleCreateNewImage = (newImage) => {
    console.log("New Canvas Created:", newImage);
  };
  return (
    <>
      {showPopup && (
        <NewImagePopup
          onClose={() => setShowPopup(false)}
          onCreate={(newImage) => {
            handleCreateNewImage(newImage);
            setShowPopup(false);
          }}
        />
      )}
      <div className="top-toolbar">
        <button onClick={() => setShowPopup(true)}>Create New Image</button>
        <button onClick={() => navigate("/")}>Back to Gallery</button>
      </div>
    </>
  );
};

export default EditorTopBar;
