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

  // reference to the canvas object for us to draw to
  const canvasRef = useRef(null);
  // automatically keeps track of canvas state on the browser storage
  const [canvasData, setCanvasData] = useLocalStorage("canvas", defaultCanvas);
  // how big a single pixel is on the actual rendering canvas:
  const pixelSize = canvasRenderWidth / pixelDrawingWidth;

  // onload
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set up initial canvas properties (optional)
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  // updates the state of a pixel at specific coordinate
  // in the react context and browser localstorage
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
  
  // outputs a pixel to the display canvas (does not save)
  const drawPixelAt = (x,y,color) => {
    const canvasX = x * pixelSize;
    const canvasY = y * pixelSize;

    // reference the canvas context for drawing to
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    // const centerX = x + pixelSize / 2;
    // const centerY = y + pixelSize / 2;

    // Draw a pixel at the clicked position
    context.fillStyle = "blue";
    context.beginPath();
    // context.arc(centerX, centerY, pixelSize/2, 0, 2 * Math.PI); // Draw a circle with radius 10
    context.fillRect(canvasX, canvasY, pixelSize, pixelSize);
    context.fill();
  };
  
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;

    // Get the bounding rectangle of the canvas
    const rect = canvas.getBoundingClientRect();

    // Get the position of the pixel that was clicked on
    const pixelX =
      Math.floor(
        (((event.clientX - rect.left) / rect.width) * canvas.width) / pixelSize
      );
    
    const pixelY =
      Math.floor(
        (((event.clientY - rect.top) / rect.height) * canvas.height) / pixelSize
      );
    

    // update the pixel in local storage
    updatePixelAt(pixelX,pixelY,"blue")
    
    // draw to the pixel on the canvas for display
    drawPixelAt(pixelX, pixelY);
    
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
