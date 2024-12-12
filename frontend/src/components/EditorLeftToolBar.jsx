import "../css/EditorPageCSS/EditorLeftToolBar.css";
import { useState, useEffect } from "react";
import ColorPickerToolbar from "./ColorPickerToolbar";
import { FaEraser, FaPencilAlt, FaEyeDropper } from "react-icons/fa";
import { PiPaintBucketFill } from "react-icons/pi";
import { MdOutlineGridOn } from "react-icons/md";

const EditorLeftToolBar = ({ selectedColor, setSelectedColor, secondaryColor, setSecondaryColor, tool, setTool, setPreviousTool, onEyeDropperClicked, toggleGridLines, gridLinesVisible }) => {

  const [colorPickerActive, setColorPickerActive] = useState(false);
  useEffect(() => {
    if (tool === "eyedropper") {
      console.log("tool: eyedropper"); 
    }
  }, [tool]);
  return (
    <div className="left-toolbar">
      <div className="icon-container">
        {/* editor buttons go here */}
        <button
          className={`icon ${tool === "pencil" ? "active" : ""} tooltip-vertical`}
          button-name="Pencil"
          onClick={() => setTool("pencil")}><FaPencilAlt />
        </button>
        <button
          className={`icon ${tool === "eraser" ? "active" : ""} tooltip-vertical`}
          button-name="Eraser"
          onClick={() => { setTool("eraser") }}><FaEraser />
        </button>
        <button
          className={`icon ${tool === "paint" ? "active" : ""} tooltip-vertical`}
          button-name="Bucket Fill"
          onClick={() => setTool("paint")} ><PiPaintBucketFill /></button>
        <button
          className={`icon ${(colorPickerActive === true || tool === 'eyedropper') ? "active" : ""} tooltip-vertical`}
          button-name="Color Picker"
          onClick={async () => {
            // check if the browser supports eye dropper
            if ("EyeDropper" in window) {
              setColorPickerActive(true);
              await onEyeDropperClicked();
              setColorPickerActive(false);
            } else {
              // if not then use the fallback "tool" eyedropper

              // store previously selected tool first
              setPreviousTool(tool);
              // then change tool to eyedropper
              setTool("eyedropper");
            }
          }}>
          <FaEyeDropper />
        </button>
        <button
          className={`icon ${gridLinesVisible ? "active" : ""} tooltip-vertical`}
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
