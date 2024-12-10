import "../css/EditorPageCSS/EditorLeftToolBar.css";
import ColorPickerToolbar from "./ColorPickerToolbar";
import { FaEraser, FaPencilAlt, FaEyeDropper } from "react-icons/fa";
import { PiPaintBucketFill } from "react-icons/pi";


const EditorLeftToolBar = ({ selectedColor, setSelectedColor, secondaryColor, setSecondaryColor, tool, setTool }) => {

  return (
    <div className="left-toolbar">
      <div className="icon-container">
        {/* editor buttons go here */}
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
          className={`icon ${tool === "eyeDropper" ? "active" : ""} tooltip-vertical`}
          button-name="Color Picker"
          onClick={() => { setTool("eyeDropper") }}><FaEyeDropper /></button>
        <button
          className={`icon ${tool === "pencil" ? "active" : ""} tooltip-vertical`}
          button-name="Pencil"
          onClick={() => setTool("pencil")}><FaPencilAlt /></button>
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
