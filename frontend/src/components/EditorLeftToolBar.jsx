import "../css/EditorPageCSS/EditorLeftToolBar.css";
import ColorPickerToolbar from "./ColorPickerToolbar";
import { FaEraser, FaPencilAlt, FaEyeDropper } from "react-icons/fa";
import { PiPaintBucketFill } from "react-icons/pi";


const EditorLeftToolBar = ({  selectedColor, setSelectedColor, secondaryColor, setSecondaryColor,tool, setTool }) => {
  return (
    <div className="left-toolbar">
      <div className = "icon-container">
        {/* editor buttons go here */}
        <button 
      className={`icon ${tool === "eraser" ? "active" : ""}`}
      onClick={() => {
        setTool("eraser");
        console.log(tool); 
      }}
      ><FaEraser />
      </button>
        <button
          className={`icon ${tool === "paint" ? "active" : ""}`}
          onClick={() => setTool("paint")}
        ><PiPaintBucketFill /></button>
          <button
          className={`icon ${tool === "eyeDropper" ? "active" : ""}`}
          onClick={() => setTool("eyeDropper")} 
        ><FaEyeDropper /></button>
        <button
          className={`icon ${tool === "pencil" ? "active" : ""}`}
          onClick={() =>{ setTool("pencil") ;console.log(tool); }}
        ><FaPencilAlt /></button>

        <button className={`icon ${tool === "clear" ? "active" : ""}`}
          onClick={() => setTool("clear")}>clear</button>
      </div>
      <div className="align-end toolbar-square">
        <ColorPickerToolbar primaryColor={selectedColor} setPrimaryColor={setSelectedColor} secondaryColor={secondaryColor} setSecondaryColor={setSecondaryColor} />
      </div>
    </div>
  );
};

export default EditorLeftToolBar;
