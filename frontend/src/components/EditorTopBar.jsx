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

const EditorTopBar = ({ contextMenuOptions, onResizeImageClicked, onImportProjectClicked, onImportImageClicked, onCreateNewImageClicked, onImageExportClicked, onShareCurrentCanvasClicked, currentCanvasSize, onSaveClicked, onTrashClearClicked }) => {

  const [popupInfo, setPopupInfo] = useState(null);

  const navigate = useNavigate();

  return (
    <>
      <ConfirmationPopup
        popupData={popupInfo}
      />

      <div className="top-toolbar">
        <Menu menuOptions={contextMenuOptions} />

        <div className="top-controls">

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
          <button onClick={onResizeImageClicked}>
            <GiResize className="icon" />
          </button>

          {/* clear canvas */}
          <button onClick={() => {
            setPopupInfo(
              {
                title: "WARNING",
                message1: "This action cannot be undone .",
                message2: "Would you like to clear the canvas?",
                onCancel: () => setPopupInfo(null),
                onConfirm: () => {
                  console.log("Confirmed!");
                  setPopupInfo(null);
                  if (onTrashClearClicked) onTrashClearClicked();
                }
              }
            )
          }}><FaTrashCan /></button>

          {/* share */}
          <button onClick={onShareCurrentCanvasClicked}><FaShareFromSquare /></button>

        </div>

        <button className="align-end mobile-hidden" onClick={() => navigate("/")}>
          <RiArrowGoBackLine className="icon mobile-hidden" /> <div className="inline small-hidden">Back to Gallery</div>
        </button>
      </div >
    </>
  );
};

export default EditorTopBar;
