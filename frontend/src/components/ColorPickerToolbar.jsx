import "../css/ColorPickerToolbar.css";
import { FaExchangeAlt } from "react-icons/fa";

function ColorPickerToolbar({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
}) {
  const handleColorSwap = () => {
    setPrimaryColor(secondaryColor);
    setSecondaryColor(primaryColor);
  };

  const defaultPrimaryColor = "#000000";
  const defaultSecondaryColor = "#FFFFFF";

  const handleDefaultColors = () => {
    setPrimaryColor(defaultPrimaryColor);
    setSecondaryColor(defaultSecondaryColor);
  };

  return (
    <div className="color-container">
      <input
        className="color-pick-first"
        type="color"
        // alpha
        colorspace="limited-srgb alpha"
        value={primaryColor}
        onChange={(e) => setPrimaryColor(e.target.value)}
      />
      <input
        className="color-pick-second"
        type="color"
        value={secondaryColor}
        onChange={(e) => setSecondaryColor(e.target.value)}
      />
      <button className="btn-color-change" onClick={handleColorSwap}>
        <FaExchangeAlt />
      </button>
      <div className="color-display-box" onClick={handleDefaultColors}>
        <div
          className="color-display-first"
          style={{ backgroundColor: defaultPrimaryColor }}
        />
        <div
          className="color-display-second"
          style={{ backgroundColor: defaultSecondaryColor }}
        />
      </div>
    </div>
  );
}

export default ColorPickerToolbar;
