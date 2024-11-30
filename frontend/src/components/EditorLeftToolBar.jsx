import "../css/EditorPageCSS/EditorLeftToolBar.css";
import ColorPickerToolbar from "./ColorPickerToolbar";

const EditorLeftToolBar = () => {
  return (
    <div className="left-toolbar">
      <p>TODO TOOLBAR</p>
      <div className="align-bottom toolbar-square">
        <ColorPickerToolbar  />
      </div>
    </div>
  );
};

export default EditorLeftToolBar;
