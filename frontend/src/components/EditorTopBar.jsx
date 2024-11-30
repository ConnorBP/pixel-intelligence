import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NewImagePopup from "../components/NewImagePopup";
import { MdOutlineAddBox } from "react-icons/md";
import { RiArrowGoBackLine, RiSave3Line } from "react-icons/ri";
import "../css/EditorPageCSS/EditorTopBar.css";
import Menu from "./Menu";

const EditorTopBar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleCreateNewImage = (newImage) => {
    console.log("New Canvas Created:", newImage);
  };
  return (
    <>
      {showPopup && (
        <NewImagePopup
          onClose={() => setShowPopup(false)}
          onCreate={(newImage) => {
            handleCreateNewImage(newImage);
            setShowPopup(false);
          }}
        />
      )}
      <div className="top-toolbar">
        <Menu />
        <button onClick={() => navigate("/")}>
          <RiArrowGoBackLine className="icon" />
          {" "}Back to Gallery
        </button>
        <button onClick={()=>{}} >
            <RiSave3Line className="icon"/>
        </button>
        <button onClick={() => setShowPopup(true)}>
          <MdOutlineAddBox className="icon" />
        </button>
      </div>
    </>
  );
};

export default EditorTopBar;
