import { useRef, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "./Canvas.css";

const Canvas = ({
  pixelDrawingWidth = 16, // determines the amount of pixels a user can draw per row
  pixelDrawingHeight = 16,
  canvasRenderWidth = 128, // determines the actual rendering of the pixels to the screen (including editor lines)
  canvasRenderHeight = 128,
}) => {

  // default canvas storage object
  // NOTE: once we deploy, we cannot change this without breaking users localstorage
  // so keep this consistent
  const defaultCanvas = {
    width: pixelDrawingWidth,
    height: pixelDrawingHeight,
    // pixels are stored in one array.
    // pixels are stored left to right then top down
    pixels: []
  };

  const canvasRef = useRef(null);
  const [canvasData, setCanvasData] = useLocalStorage("canvas", defaultCanvas);

  // onload
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set up initial canvas properties (optional)
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  const updatePixelAt = (x,y,color) => {
    setCanvasData(oldCanvas => {
      console.log('setCanvas called with ', oldCanvas);
      // don't allow out of bounds access
      if(x >= oldCanvas.width || y >= oldCanvas.height) {
        console.error(`X ${x} Y ${y} is out of bounds in canvas of size: {${x}, ${y}}`);
        return oldCanvas;
      }
      const newCanvas = {...oldCanvas};
      // insert pixel at x position starting at row base (y*width)
      newCanvas.pixels[x+(y*newCanvas.width)] = color;
      console.log('returning from setCanvas with ', newCanvas);
      return newCanvas;
    });
  };
  
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Get the bounding rectangle of the canvas
    const rect = canvas.getBoundingClientRect();

    const pixelSize = canvasRenderWidth / pixelDrawingWidth;

    // Get the position of the pixel that was clicked on
    const pixelX =
      Math.floor(
        (((event.clientX - rect.left) / rect.width) * canvas.width) / pixelSize
      );
    const canvasX = pixelX * pixelSize;
    const pixelY =
      Math.floor(
        (((event.clientY - rect.top) / rect.height) * canvas.height) / pixelSize
      );
    const canvasY = pixelY * pixelSize;
    // const centerX = topLeftX + pixelSize / 2;
    // const centerY = topLeftY + pixelSize / 2;

    // update the pixel in local storage
    updatePixelAt(pixelX,pixelY,"blue")


    // Draw a circle at the clicked position
    context.fillStyle = "blue";
    context.beginPath();
    // context.arc(centerX, centerY, pixelSize/2, 0, 2 * Math.PI); // Draw a circle with radius 10
    context.fillRect(canvasX, canvasY, pixelSize, pixelSize);
    context.fill();
  };

  useEffect(() => {
    console.log("canvas resized");
  }, [pixelDrawingWidth, pixelDrawingHeight]);

  return (
    <>
      <canvas
        className="pixel-canvas"
        ref={canvasRef}
        width={canvasRenderWidth}
        height={canvasRenderHeight}
        onClick={handleCanvasClick}
      ></canvas>
    </>
  );
};

export default Canvas;
