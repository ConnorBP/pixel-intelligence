import "../css/EditorPageCSS/EditorLeftToolBar.css";
import ColorPickerToolbar from "./ColorPickerToolbar";

const EditorLeftToolBar = ({selectedColor, setSelectedColor, secondaryColor, setSecondaryColor}) => {
  return (
    <div className="left-toolbar">
      <p>TODO TOOLBAR</p>
      <div>
        {/* editor buttons go here */}
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
      </div>
      <div className="align-end toolbar-square">
        <ColorPickerToolbar  primaryColor={selectedColor} setPrimaryColor={setSelectedColor} secondaryColor={secondaryColor} setSecondaryColor={setSecondaryColor} />
      </div>
    </div>
  );
};

export default EditorLeftToolBar;
