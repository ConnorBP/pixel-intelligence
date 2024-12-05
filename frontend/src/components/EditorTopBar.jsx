import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NewImagePopup from "../components/NewImagePopup";
import { MdOutlineAddBox } from "react-icons/md";
import { RiArrowGoBackLine, RiSave3Line } from "react-icons/ri";
import { GiResize } from "react-icons/gi";
import { FaFileImport, FaShareFromSquare, FaTrashCan, FaRegFolderOpen } from "react-icons/fa6";
import { IoIosDownload } from "react-icons/io";
import "../css/EditorPageCSS/EditorTopBar.css";
import Menu from "./Menu";
import ConfirmationPopup from "./ConfirmationPopup";
import ScaleImagePopup from "./ScaleImagePopup";

const EditorTopBar = ({ contextMenuOptions, onResizeImageRequested, onImportImageClicked, onImageExportClicked, currentCanvasSize }) => {
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

        {/* save json file to disc */}
        <button onClick={() => { setShowSaveNotYetImplemented(true) }}>
          <RiSave3Line className="icon" />
        </button>
        {/* import a canvas data json from disc */}
        <button onClick={() => { setShowSaveNotYetImplemented(true) }}>
          <FaRegFolderOpen className="icon" />
        </button>
        {/* import an image from disc */}
        <button onClick={onImportImageClicked}>
          <FaFileImport className="icon" />
        </button>
        {/* create new image generation and canvas */}
        <button onClick={() => setShowNewImagePrompt(true)}>
          <MdOutlineAddBox className="icon" />
        </button>
        {/* resize canvas */}
        <button onClick={() => setShowResizePrompt(true)}>
          <GiResize className="icon" />
        </button>
        {/* export image */}
        <button onClick={onImageExportClicked}>
          <IoIosDownload className="icon" />
        </button>
        {/* clear canvas */}
        <button><FaTrashCan /></button>
        {/* share */}
        <button><FaShareFromSquare /></button>

        <button className="align-end" onClick={() => navigate("/")}>
          <RiArrowGoBackLine className="icon" /> Back to Gallery
        </button>
      </div>
    </>
  );
};

export default EditorTopBar;
