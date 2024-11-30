import Canvas from "../components/Canvas";
import EditorLeftToolBar from "../components/EditorLeftToolBar";
import EditorTopBar from "../components/EditorTopBar";
import "../css/EditorPageCSS/Editor.css";
import { useLocalStorage } from "../hooks/useLocalStorage";

const Editor = () => {
  const [brushColor, setBrushColor] = useLocalStorage("primaryBrushColor", "#000000");
  const [secondaryBrushColor, setSecondaryBrushColor] = useLocalStorage("secondaryBrushColor", "#FFFFFF");

  return (
    <div className="editor-container">
      <EditorTopBar />
      <EditorLeftToolBar
        selectedColor={brushColor}
        setSelectedColor={setBrushColor}
        secondaryColor={secondaryBrushColor}
        setSecondaryColor={setSecondaryBrushColor}
      />
      <div className="canvas-container">
        <Canvas brushColor={brushColor}/>
      </div>
    </div>
  );
};

export default Editor;
