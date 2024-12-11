import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineAddBox } from "react-icons/md";
import { RiArrowGoBackLine, RiSave3Line } from "react-icons/ri";
import { GiResize } from "react-icons/gi";
import { FaFileImport, FaShareFromSquare, FaTrashCan, FaRegFolderOpen } from "react-icons/fa6";
import { IoIosDownload } from "react-icons/io";
import "../css/EditorPageCSS/EditorTopBar.css";
import Menu from "./Menu.jsx";
import ConfirmationPopup from "./ConfirmationPopup.jsx";

const EditorTopBar = ({
  contextMenuOptions,
  onResizeImageClicked,
  onImportProjectClicked,
  onImportImageClicked,
  onCreateNewImageClicked,
  onImageExportClicked,
  onShareCurrentCanvasClicked,
  onSaveClicked,
  onTrashClearClicked
}) => {

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
          <button className="tooltip" button-name="Generate New" onClick={onCreateNewImageClicked}>
            <MdOutlineAddBox className="icon" />
          </button>

          {/* save json file to disc */}
          <button className="tooltip" button-name="Save JSON" onClick={onSaveClicked}>
            <RiSave3Line className="icon" />
          </button>

          {/* import a canvas data json from disc */}
          <button className="tooltip" button-name="Import JSON" onClick={onImportProjectClicked}>
            <FaRegFolderOpen className="icon" />
          </button>

          {/* import an image from disc */}
          <button className="tooltip" button-name="Import Image" onClick={onImportImageClicked}>
            <FaFileImport className="icon" />
          </button>


          {/* export image */}
          <button className="tooltip" button-name="Export Image" onClick={onImageExportClicked}>
            <IoIosDownload className="icon" />
          </button>

          {/* resize canvas */}
          <button className="tooltip" button-name="Resize Canvas" onClick={onResizeImageClicked}>
            <GiResize className="icon" />
          </button>

          {/* clear canvas */}
          <button className="tooltip" button-name="Clear Canvas" onClick={() => {
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
          <button className="tooltip" button-name="Share" onClick={onShareCurrentCanvasClicked}><FaShareFromSquare /></button>

        </div>

        <button className="align-end mobile-hidden" onClick={() => navigate("/")}>
          <RiArrowGoBackLine className="icon mobile-hidden" /> <div className="inline small-hidden">Back to Gallery</div>
        </button>
      </div>
    </>
  );
};

export default EditorTopBar;
