import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NewImagePopup from "../components/NewImagePopup";
import { MdOutlineAddBox } from "react-icons/md";
import { RiArrowGoBackLine, RiSave3Line } from "react-icons/ri";
import { GiResize } from "react-icons/gi";
import { FaFileImport } from "react-icons/fa6";
import { IoIosDownload } from "react-icons/io";
import "../css/EditorPageCSS/EditorTopBar.css";
import Menu from "./Menu";
import ConfirmationPopup from "./ConfirmationPopup";
import ScaleImagePopup from "./ScaleImagePopup";

const EditorTopBar = ({ contextMenuOptions, onResizeImageRequested, onImportImageClicked, currentCanvasSize }) => {
  const [showNewImagePrompt, setShowNewImagePrompt] = useState(false);
  const [showSaveNotYetImplemented, setShowSaveNotYetImplemented] = useState(false);
  const [showResizePrompt, setShowResizePrompt] = useState(false);

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
        onCancel={() => setShowSaveNotYetImplemented(false)}
        onConfirm={() => {
          console.log("Confirmed!");
          setShowSaveNotYetImplemented(false);
        }}
      />

      <NewImagePopup
        isOpen={showNewImagePrompt}
        onClose={() => { setShowNewImagePrompt(false) }}
        onCreate={(newImage) => {
          handleCreateNewImage(newImage);
          setShowNewImagePrompt(false);
        }}
      />

      <ScaleImagePopup isOpen={showResizePrompt} setIsOpen={setShowResizePrompt} onConfirm={onResizeImageRequested} currentCanvasSize={currentCanvasSize} />

      <div className="top-toolbar">
        <Menu menuOptions={contextMenuOptions} />

        <button onClick={() => { setShowSaveNotYetImplemented(true) }}>
          <RiSave3Line className="icon" />
        </button>
        <button onClick={onImportImageClicked}>
          <FaFileImport className="icon" />
        </button>
        <button onClick={() => setShowNewImagePrompt(true)}>
          <MdOutlineAddBox className="icon" />
        </button>
        <button onClick={() => setShowResizePrompt(true)}>
          <GiResize className="icon" />
        </button>
        <button onClick={() => setShowResizePrompt(true)}>
          <IoIosDownload className="icon" />
        </button>

        <button className="align-end" onClick={() => navigate("/")}>
          <RiArrowGoBackLine className="icon" /> Back to Gallery
        </button>
      </div>
    </>
  );
};

export default EditorTopBar;
