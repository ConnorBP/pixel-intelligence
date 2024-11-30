import Canvas from "../components/Canvas";
import EditorLeftToolBar from "../components/EditorLeftToolBar";
import EditorTopBar from "../components/EditorTopBar";
import '../css/EditorPageCSS/Editor.css';

const Editor = () => {
  return (
    <div className="editor-container">
      <EditorTopBar />
      <EditorLeftToolBar />
      <div className="canvas-container">
        <Canvas />
      </div>
    </div>
  );
};

export default Editor;
