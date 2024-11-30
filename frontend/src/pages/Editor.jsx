import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Canvas from "../components/Canvas";
import NewImagePopup from "../components/NewImagePopup";

const Editor = () => {
  const [showPopup, setShowPopup] = useState(false); 
  const navigate = useNavigate(); 

  const handleCreateNewImage = (newImage) => {
    console.log("New Canvas Created:", newImage);
  };
  return (
    <div className="editor_container">
      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => setShowPopup(true)}>Create New Image</button>
        <button onClick={() => navigate("/")}>Back to Gallery</button>
      </div>
      {showPopup && (
        <NewImagePopup
          onClose={() => setShowPopup(false)}
          onCreate={(newImage) => {
            handleCreateNewImage(newImage);
            setShowPopup(false);
          }}
        />
      )}
      <Canvas /> 
    </div>
  );
};

export default Editor;
