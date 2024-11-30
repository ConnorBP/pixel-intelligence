import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NewImagePopup from "../components/NewImagePopup";
import { MdOutlineAddBox } from "react-icons/md";
import { RiArrowGoBackLine, RiSave3Line } from "react-icons/ri";
import "../css/EditorPageCSS/EditorTopBar.css";
import Menu from "./Menu";
import ConfirmationPopup from "./ConfirmationPopup";

const EditorTopBar = () => {
  const [showNewImagePrompt, setShowNewImagePrompt] = useState(false);
  const [showSaveNotYetImplemented, setShowSaveNotYetImplemented] = useState(false);
  const navigate = useNavigate();

  const handleCreateNewImage = (newImage) => {
    console.log("New Canvas Created:", newImage);
  };
  return (
    <>
      <ConfirmationPopup
        isOpen={showSaveNotYetImplemented}
        title="Info"
        message1="This action has not yet been implemented."
        message2=""
        onCancel={()=>setShowSaveNotYetImplemented(false)}
        onConfirm={() => {
          console.log("Confirmed!");
          setShowSaveNotYetImplemented(false);
        }}
      />
      {showNewImagePrompt && (
        <NewImagePopup
          onClose={() => setShowNewImagePrompt(false)}
          onCreate={(newImage) => {
            handleCreateNewImage(newImage);
            setShowNewImagePrompt(false);
          }}
        />
      )}
      <div className="top-toolbar">
        <Menu />
        <button onClick={() => navigate("/")}>
          <RiArrowGoBackLine className="icon" /> Back to Gallery
        </button>
        <button onClick={() => {setShowSaveNotYetImplemented(true)}}>
          <RiSave3Line className="icon" />
        </button>
        <button onClick={() => setShowNewImagePrompt(true)}>
          <MdOutlineAddBox className="icon" />
        </button>
      </div>
    </>
  );
};

export default EditorTopBar;
