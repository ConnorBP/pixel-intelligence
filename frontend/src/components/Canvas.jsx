import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "../css/Canvas.css";

const Canvas = forwardRef(({
  canvasData,
  setCanvasData,
  canvasRenderWidth = 128, // determines the actual rendering of the pixels to the screen (including editor lines)
  canvasRenderHeight = 128,
  brushColor = "blue",
}, ref) => {


  //
  // State
  //

  // reference to the canvas object for us to draw to
  const canvasRef = useRef(null);
  // automatically keeps track of canvas state on the browser storage

  // how big a single pixel is on the actual rendering canvas:
  const pixelSize = canvasRenderWidth / canvasData.width;

  // updates the state of a pixel at specific coordinate
  // in the react context and browser localstorage
  const updatePixelAt = (x, y, color) => {
    setCanvasData((oldCanvas) => {
      // console.log("setCanvas called with ", oldCanvas);
      // don't allow out of bounds access
      if (x >= oldCanvas.width || y >= oldCanvas.height) {
        console.error(
          `X ${x} Y ${y} is out of bounds in canvas of size: {${x}, ${y}}`
        );
        return oldCanvas;
      }
      const newCanvas = { ...oldCanvas };
      // insert pixel at x position starting at row base (y*width)
      newCanvas.pixels[x + y * newCanvas.width] = color;
      // console.log("returning from setCanvas with ", newCanvas);
      return newCanvas;
    });
  };



  // attempt to load a provided canvas json representation
  // it is "try" because the loaded data can be tampered with by the user
  // or be incompatible due to updates
  const tryLoadCanvas = (canvasData, storeOnLoad = false) => {
    console.info("loading canvas state with object: ", canvasData);
    try {
      // catch some bad inputs
      if (!canvasData) {
        console.error("cannot load a null canvas document ", canvasData);
        return false;
      }
      // check for valid canvas size
      // todo: this should check against a set list of our presets
      if (
        !canvasData.width ||
        !canvasData.height ||
        canvasData.width < 16 ||
        canvasData.height < 16 ||
        canvasData.width != canvasData.height // only accept square canvas
      ) {
        console.error(
          "got invalid canvas size while trying to load canvas document ",
          canvasData
        );
        return false;
      }

      if (
        !canvasData.pixels ||
        !canvasData.pixels.length ||
        canvasData.pixels.length <= 0
      ) {
        console.error("cannot load an empty pixels array ", canvasData);
        return false;
      }

      if (canvasData.pixels.length > canvasData.width * canvasData.height) {
        console.error("pixels array was larger than the canvas resolution");
        return false;
      }

      // for (let i = 0; i<canvasData.pixels.length; i++ ) {
      //   const pixel = canvasData.pixels[i];
      // }

      canvasData.pixels.forEach((pixel, i) => {
        
        const x = i % canvasData.width;
        const y = Math.floor(i / canvasData.width);
        // console.log(`drawing ${pixel} at ${x} ${y}`);
        drawPixelAt(x, y, pixel);
        // optionally, store to react state on load as well
        if (storeOnLoad) {
          updatePixelAt;
        }
      });
    } catch (err) {
      // in case of pesky bugs from errors or malicious input
      console.error("Failed to load canvas data. Unexpected Error: ", err);
      return false;
    }
    // if nothing failed by here, it was a great success :)
    return true;
  };

  // outputs a pixel to the display canvas (does not save)
  const drawPixelAt = (x, y, color) => {
    // don't run on empty pixels
    if (color == null) {
      return;
    }

    const canvasX = x * pixelSize;
    const canvasY = y * pixelSize;

    // reference the canvas context for drawing to
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    // const centerX = x + pixelSize / 2;
    // const centerY = y + pixelSize / 2;

    // Draw a pixel at the clicked position
    context.fillStyle = color;
    context.beginPath();
    // context.arc(centerX, centerY, pixelSize/2, 0, 2 * Math.PI); // Draw a circle with radius 10
    context.fillRect(canvasX, canvasY, pixelSize, pixelSize);
    context.fill();
  };

  // Handles the event of someone clicking on the canvas area
  // Currently only supports single click drawing
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;

    // Get the bounding rectangle of the canvas
    const rect = canvas.getBoundingClientRect();

    // Get the position of the pixel that was clicked on
    const pixelX = Math.floor(
      (((event.clientX - rect.left) / rect.width) * canvas.width) / pixelSize
    );

    const pixelY = Math.floor(
      (((event.clientY - rect.top) / rect.height) * canvas.height) / pixelSize
    );

    // update the pixel in local storage
    updatePixelAt(pixelX, pixelY, brushColor);

    // draw to the pixel on the canvas for display
    drawPixelAt(pixelX, pixelY, brushColor);
  };

  // forward the draw single pixel function for efficiency
  useImperativeHandle(ref, () => {
    return {
      drawPixelAt,
      tryLoadCanvas,
      canvasRef
    }
  }, [canvasRef]);


  //
  // Hooks
  //

  // On Load
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set up initial canvas properties (optional)
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, canvas.width, canvas.height);

    tryLoadCanvas(canvasData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Todo: Handle resize
  useEffect(() => {
    console.log("canvas contents resized or changed");
    // tryLoadCanvas(canvasData);
  }, [canvasData]);

  return (
    <>
      <canvas
        className="editor-canvas"
        ref={canvasRef}
        width={canvasRenderWidth}
        height={canvasRenderHeight}
        onClick={handleCanvasClick}
      ></canvas>
    </>
  );
});

export default Canvas;
