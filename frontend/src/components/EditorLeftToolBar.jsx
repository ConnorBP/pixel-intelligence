import "../css/EditorPageCSS/EditorLeftToolBar.css";
import { useState } from "react";
import ColorPickerToolbar from "./ColorPickerToolbar";
import { FaEraser, FaPencilAlt, FaEyeDropper } from "react-icons/fa";
import { PiPaintBucketFill } from "react-icons/pi";
import { MdOutlineGridOn } from "react-icons/md";

const EditorLeftToolBar = ({ selectedColor, setSelectedColor, secondaryColor, setSecondaryColor, tool, setTool, onEyeDropperClicked, toggleGridLines, gridLinesVisible }) => {

  const [colorPickerActive, setColorPickerActive] = useState(false);

  return (
    <div className="left-toolbar">
      <div className="icon-container">
        {/* editor buttons go here */}
        <button
          className={`one-hundo-pw icon ${tool === "pencil" ? "active" : ""} tooltip-vertical`}
          button-name="Pencil"
          onClick={() => setTool("pencil")}><FaPencilAlt />
        </button>
        <button
          className={`one-hundo-pw icon ${tool === "eraser" ? "active" : ""} tooltip-vertical`}
          button-name="Eraser"
          onClick={() => { setTool("eraser") }}><FaEraser />
        </button>
        <button
          className={`one-hundo-pw icon ${tool === "paint" ? "active" : ""} tooltip-vertical`}
          button-name="Bucket Fill"
          onClick={() => setTool("paint")} ><PiPaintBucketFill /></button>
        <button
          className={`one-hundo-pw icon ${colorPickerActive === true ? "active" : ""} tooltip-vertical`}
          button-name="Color Picker"
          onClick={async () => {
            if (onEyeDropperClicked) {
              setColorPickerActive(true);
              await onEyeDropperClicked();
              setColorPickerActive(false);
            }

          }}>
          <FaEyeDropper />
        </button>
        <button
          className={`one-hundo-pw icon ${gridLinesVisible ? "active" : ""} tooltip-vertical`}
          button-name="Grid"
          onClick={toggleGridLines}>
          <MdOutlineGridOn />
        </button>
      </div>
      <div className="align-end toolbar-square">
        <ColorPickerToolbar
          primaryColor={selectedColor}
          setPrimaryColor={setSelectedColor}
          secondaryColor={secondaryColor}
          setSecondaryColor={setSecondaryColor}
        />
      </div>
    </div>
  );
};

export default EditorLeftToolBar;
