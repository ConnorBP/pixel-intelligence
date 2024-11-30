import "../css/EditorPageCSS/EditorLeftToolBar.css";
import ColorPickerToolbar from "./ColorPickerToolbar";

const EditorLeftToolBar = ({selectedColor, setSelectedColor, secondaryColor, setSecondaryColor}) => {
  return (
    <div className="left-toolbar">
      <p>TODO TOOLBAR</p>
      <div className="align-bottom toolbar-square">
        <ColorPickerToolbar  primaryColor={selectedColor} setPrimaryColor={setSelectedColor} secondaryColor={secondaryColor} setSecondaryColor={setSecondaryColor} />
      </div>
    </div>
  );
};

export default EditorLeftToolBar;
