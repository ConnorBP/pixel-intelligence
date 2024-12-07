import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";
import { RiArrowGoBackLine, RiSave3Line } from "react-icons/ri";
import { GiResize } from "react-icons/gi";
import { FaFileImport, FaShareFromSquare, FaTrashCan, FaRegFolderOpen } from "react-icons/fa6";
import { IoIosDownload } from "react-icons/io";
import "../css/EditorPageCSS/EditorTopBar.css";
import Menu from "./Menu";
import ConfirmationPopup from "./ConfirmationPopup";
import ScaleImagePopup from "./ScaleImagePopup";

const EditorTopBar = ({ contextMenuOptions, onResizeImageRequested, onImportProjectClicked, onImportImageClicked, onCreateNewImageClicked, onImageExportClicked, onShareCurrentCanvasClicked, currentCanvasSize, onSaveClicked, onTrashClearClicked }) => {

  const [showConfirmClearCanvas, setShowConfirmClearCanvas] = useState(false);
  const [showResizePrompt, setShowResizePrompt] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <ConfirmationPopup
        isOpen={showConfirmClearCanvas}
        title="WARNING"
        message1="This action cannot be undone  ."
        message2=""
        onCancel={() => setShowConfirmClearCanvas(false)}
        onConfirm={() => {
          console.log("Confirmed!");
          setShowConfirmClearCanvas(false);
          if (onTrashClearClicked) onTrashClearClicked();
        }}
      />

      <ScaleImagePopup isOpen={showResizePrompt} setIsOpen={setShowResizePrompt} onConfirm={onResizeImageRequested} currentCanvasSize={currentCanvasSize} />

      <div className="top-toolbar">
        <Menu menuOptions={contextMenuOptions} />

        {/* create new image generation and canvas */}
        <button onClick={onCreateNewImageClicked}>
          <MdOutlineAddBox className="icon" />
        </button>

        {/* save json file to disc */}
        <button onClick={onSaveClicked}>
          <RiSave3Line className="icon" />
        </button>

        {/* import a canvas data json from disc */}
        <button onClick={onImportProjectClicked}>
          <FaRegFolderOpen className="icon" />
        </button>

        {/* import an image from disc */}
        <button onClick={onImportImageClicked}>
          <FaFileImport className="icon" />
        </button>


        {/* export image */}
        <button onClick={onImageExportClicked}>
          <IoIosDownload className="icon" />
        </button>

        {/* resize canvas */}
        <button onClick={() => setShowResizePrompt(true)}>
          <GiResize className="icon" />
        </button>

        {/* clear canvas */}
        <button onClick={() => { setShowConfirmClearCanvas(true) }}><FaTrashCan /></button>

        {/* share */}
        <button onClick={onShareCurrentCanvasClicked}><FaShareFromSquare /></button>

        <button className="align-end" onClick={() => navigate("/")}>
          <RiArrowGoBackLine className="icon" /> Back to Gallery
        </button>
      </div>
    </>
  );
};

export default EditorTopBar;
