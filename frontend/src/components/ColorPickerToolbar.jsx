import "../css/ColorPickerToolbar.css";
import { FaExchangeAlt } from "react-icons/fa";

function ColorPickerToolbar({primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor}) {

 const firstSmallBoxDefaultColor = "#000000";
 const secondSmallBoxDefaultColor = "#FFFFFF";
 
const handleChangeSmallBox = ()=>{
 
    setPrimaryColor(firstSmallBoxDefaultColor)
    setSecondaryColor(secondSmallBoxDefaultColor)
  
} 
const handleColorPickerFirst = (event) => {
  setPrimaryColor(event.target.value); 
};

  const handleColorPickerSecond = (event) => {
    setSecondaryColor(event.target.value);
  };

  const handleChange = () => {
    const temp = primaryColor;
    setPrimaryColor(secondaryColor);
    setSecondaryColor(temp);
  };
  return (
    <div className="color-container">
      
        <input
          className="color-pcik-first"
          type="color"
          value={primaryColor} 
          onChange={handleColorPickerFirst}
         
        />
        <input
          className="color-pcik-second"
          type="color"
          value={secondaryColor}
          onChange={handleColorPickerSecond}
        />
        <button className="btn-color-change" onClick={handleChange}>
          <FaExchangeAlt />
        </button>
      
      <div className="color-display-box">
        <div
          className="color-display-first"
          style={{ backgroundColor: firstSmallBoxDefaultColor }}
          onClick={handleChangeSmallBox}
        >
          <p
            className="color-box-first"
            style={{ visibility: "hidden", margin: 0 }}
          >
            {primaryColor}
          </p>
        </div>

        <div
          className="color-display-second"
          style={{ backgroundColor: secondSmallBoxDefaultColor}}
          onClick={handleChangeSmallBox}
        >
          <p
            className="color-box-first"
            style={{ visibility: "hidden", margin: 0 }}
          >
            {secondaryColor}
          </p>
        </div>
      </div>
    </div>
  );
}
export default ColorPickerToolbar;
