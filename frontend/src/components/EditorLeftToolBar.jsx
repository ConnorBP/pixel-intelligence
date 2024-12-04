import "../css/EditorPageCSS/EditorLeftToolBar.css";
import ColorPickerToolbar from "./ColorPickerToolbar";
import { FaEraser, FaPencilAlt, FaEyeDropper } from "react-icons/fa";
import { PiPaintBucketFill } from "react-icons/pi";


const EditorLeftToolBar = ({ selectedColor, setSelectedColor, secondaryColor, setSecondaryColor }) => {
  return (
    <div className="left-toolbar">
      <p>TODO TOOLBAR</p>
      <div>
        {/* editor buttons go here */}
        <button><FaEraser /></button>
        <button><PiPaintBucketFill /></button>
        <button><FaEyeDropper /></button>
        <button><FaPencilAlt /></button>
      </div>
      <div className="align-end toolbar-square">
        <ColorPickerToolbar primaryColor={selectedColor} setPrimaryColor={setSelectedColor} secondaryColor={secondaryColor} setSecondaryColor={setSecondaryColor} />
      </div>
    </div>
  );
};

export default EditorLeftToolBar;
