import { useState } from "react";
import "../css/ColorPickerToolbar.css";
import { FaExchangeAlt } from "react-icons/fa";

function ColorPickerToolbar() {
  const [firstColor, setFirstColor] = useState("#000000");
  const [secondColor, setSecondColor] = useState("#ffffff");

  const handleColorPickerFirst = (event) => {
    setFirstColor(event.target.value);
  };
  const handleColorPickerSecond = (event) => {
    setSecondColor(event.target.value);
  };
  const handleChange = () => {
    const temp = firstColor;
    setFirstColor(secondColor);
    setSecondColor(temp);
  };
  return (
    <div className="color-container">
      
        <input
          className="color-pcik-first"
          type="color"
          value={firstColor}
          onChange={handleColorPickerFirst}
        />
        <input
          className="color-pcik-second"
          type="color"
          value={secondColor}
          onChange={handleColorPickerSecond}
        />
        <button className="btn-color-change" onClick={handleChange}>
          <FaExchangeAlt />
        </button>
      
      <div className="color-display-box">
        <div
          className="color-display-first"
          style={{ backgroundColor: firstColor }}
        >
          <p
            className="color-box-first"
            style={{ visibility: "hidden", margin: 0 }}
          >
            {firstColor}
          </p>
        </div>

        <div
          className="color-display-second"
          style={{ backgroundColor: secondColor }}
        >
          <p
            className="color-box-first"
            style={{ visibility: "hidden", margin: 0 }}
          >
            {secondColor}
          </p>
        </div>
      </div>
    </div>
  );
}
export default ColorPickerToolbar;
