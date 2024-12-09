export const handleEyeDropper = async (onColorSelect) => {
    const eyeDropper = new EyeDropper();
  
    try {
      const result = await eyeDropper.open();
      const colorCode = result.sRGBHex;
  
      if (onColorSelect) {
        onColorSelect(colorCode); 
      }
      return colorCode;
    } catch (error) {
      console.error("Color selection error:", error);
      return null;
    }
  };
  