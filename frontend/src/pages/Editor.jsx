import Canvas from "../components/Canvas";
import EditorLeftToolBar from "../components/EditorLeftToolBar";
import EditorTopBar from "../components/EditorTopBar";
import "../css/EditorPageCSS/Editor.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const Editor = () => {
  const [brushColor, setBrushColor] = useLocalStorage("primaryBrushColor", "#000000");
  const [secondaryBrushColor, setSecondaryBrushColor] = useLocalStorage("secondaryBrushColor", "#FFFFFF");
  const nav = useNavigate();

  const contextMenuOptions = [
    { text: "New Drawing", onClick: ()=> alert('todo') },
    { text: "Open", onClick: ()=> alert('todo') },
    { text: "View Gallery", onClick: () => nav("/") },
    { text: "Share", onClick: ()=> alert('todo') },
    { text: "Open", onClick: ()=> alert('todo') },
    { text: "Download", onClick: ()=> alert('todo') },
  ];

  return (
    <div className="editor-container">
      <EditorTopBar contextMenuOptions={contextMenuOptions}/>
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
