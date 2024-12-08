import "../css/ColorPickerToolbar.css";
import { FaExchangeAlt } from "react-icons/fa";

function ColorPickerToolbar({primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor}) {

 const fisrtSmallBox = "#000000";
 const secondSmallBox = "#FFFFFF";
 
const handleChangeSmallBox=(box)=>{
  const temp = primaryColor;
  if(box === 'first'){
    setPrimaryColor(fisrtSmallBox)
    setSecondaryColor(temp);
  }else if(box ==='second'){
    setPrimaryColor(secondSmallBox)
    setSecondaryColor(temp);
  }
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
          style={{ backgroundColor: fisrtSmallBox }}
          onClick={()=>{handleChangeSmallBox('first')}}
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
          style={{ backgroundColor: secondSmallBox}}
          onClick={()=>handleChangeSmallBox('second')}
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
