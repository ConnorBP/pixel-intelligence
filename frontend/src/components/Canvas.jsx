import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback,useState } from "react";

import "../css/Canvas.css";
import {
  drawCheckeredBackground,
  drawPixelToCtx,
  drawCheckeredPixel,
  handleEyeDropper
} from "../utils";
// eslint-disable-next-line react/display-name
const Canvas = forwardRef(
  (
    {
      canvasData,
      setCanvasData,
      canvasRenderWidth = 128, // determines the actual rendering of the pixels to the screen (including editor lines)
      canvasRenderHeight = 128,
      brushColor = "blue",
      drawGridLines = true,
      gridLineWidth = 1,
      gridLineColor = "#000000",
      tool,     
      onColorSelected,
      showGridLines,
      toggleGrid
    },
    ref
  ) => {
    //
    // State
    //
    const isDrawing = useRef(false);
    // reference to the canvas object for us to draw to
    const canvasRef = useRef(null);
    // how big a single pixel is on the actual rendering canvas:
    // this should be calculated on demand
    // const pixelSize = canvasRenderWidth / canvasData.width;
  
    // updates the state of a pixel at specific coordinate
    // on the provided canvas data and returns it
    const updatePixelAt = (oldCanvas, x, y, color) => {
   
      console.log(`updatePixelAt called with  ${oldCanvas} ${x} ${y} ${color}`);
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
    };

    function drawGridLineX(context, x, gridSpacing, canvasH) {
      context.beginPath();
      context.strokeStyle = gridLineColor;
      context.moveTo(-0.5 + x * gridSpacing, 0);
      context.lineTo(-0.5 + x * gridSpacing, canvasH);
      context.stroke();
    }
    function drawGridLineY(context, y, gridSpacing, canvasW) {
      context.beginPath();
      context.moveTo(0, -0.5 + y * gridSpacing);
      context.lineTo(canvasW, -0.5 + y * gridSpacing);
      context.stroke();
    }
 
    // fixes the grid lines on all four sides at a specific pixel coordinate
    function fixGridLinesAt(context, x, y, gridSpacing, canvasW, canvasH) {
      drawGridLineX(context, x, gridSpacing, canvasH);
      drawGridLineY(context, y, gridSpacing, canvasW);
      drawGridLineX(context, x + 1, gridSpacing, canvasH);
      drawGridLineY(context, y + 1, gridSpacing, canvasW);
    }
   
    function drawAllGridLines(canvas, editorPixelsW, editorPixelsH) {
      if (!showGridLines) return; 
      // draw all grid lines on the canvas
      const context = canvas.getContext("2d");

      const gridSpacing = canvas.width / editorPixelsW;

      context.lineWidth = gridLineWidth;
      console.log("drawing grid lines");
      for (let x = 0; x < editorPixelsW; x++) {
        drawGridLineX(context, x, gridSpacing, canvas.height);
      }
      for (let y = 0; y < editorPixelsH; y++) {
        drawGridLineY(context, y, gridSpacing, canvas.width);
      }
    }
    

    // clears the canvas with a background grid
    // only clears the visual display by default, but you can make it clear the data too
    const clearCanvas = useCallback((
      canvas,
      editorPixelsW,
      editorPixelsH,
      updateDataOnClear = false
    ) => {
      const context = canvas.getContext("2d");
      if (!canvas) return;
      drawCheckeredBackground(
        context,
        editorPixelsW*2,
        editorPixelsH*2,
        canvas.width,
        canvas.height
      );

      if (showGridLines) {
      
        // draw all grid lines on the canvas
        drawAllGridLines(canvas, editorPixelsW, editorPixelsH);
      }else{
        toggleGrid()
      }
    
      drawAllGridLines(canvas, editorPixelsW, editorPixelsH);
      if (updateDataOnClear) {
        setCanvasData((oldCanvas) => {
          // deep copy (make react update)
          let newCanvas = { ...oldCanvas };
          newCanvas.pixels = [];
          return newCanvas;
        });
      }
      // if (!showGridLines) {
      //   drawAllGridLines(canvas, editorPixelsW, editorPixelsH);
      // }
      // context.fill();
    });

    // attempt to load a provided canvas json representation
    // it is "try" because the loaded data can be tampered with by the user
    // or be incompatible due to updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          canvasData.width < 8 ||
          canvasData.height < 8 ||
          canvasData.width != canvasData.height // only accept square canvas
        ) {
          console.error(
            "got invalid canvas size while trying to load canvas document ",
            canvasData
          );
          return false;
        }

        // at this point we can initialize the checkered bg
        const canvas = canvasRef.current;
        if (canvas) {
          clearCanvas(canvas, canvasData.width, canvasData.height);
        } else {
          console.error(
            "html rendering canvas component was null in tryLoadCanvas"
          );
          return false;
        }

        if (
          !canvasData.pixels ||
          !canvasData.pixels.length ||
          canvasData.pixels.length <= 0
        ) {
          console.info("loaded empty canvas");
          // console.error("cannot load an empty pixels array ", canvasData);
          return true;
        }

        if (canvasData.pixels.length > canvasData.width * canvasData.height) {
          console.warn(
            "pixels array was larger than the canvas resolution. Truncating pixel data"
          );
          // return false;
          // we will truncate the array and try anyways
          canvasData.pixels.length = canvasData.width * canvasData.height;
        }

        // for (let i = 0; i<canvasData.pixels.length; i++ ) {
        //   const pixel = canvasData.pixels[i];
        // }

        canvasData.pixels.forEach((pixel, i) => {
          const x = i % canvasData.width;
          const y = Math.floor(i / canvasData.width);
          // console.log(`drawing ${pixel} at ${x} ${y}`);
          drawPixelAt(x, y, pixel, canvasData.width);
        });

        // optionally, store to react state on load as well
        if (storeOnLoad) {
          // warning: not very efficient
          setCanvasData(canvasData);
        }

        if (drawGridLines) {
          // draw all grid lines on the canvas
          drawAllGridLines(canvas, canvasData.width, canvasData.height);
        }
      } catch (err) {
        // in case of pesky bugs from errors or malicious input
        console.error("Failed to load canvas data. Unexpected Error: ", err);
        return false;
      }
      // if nothing failed by here, it was a great success :)
      return true;
    };
    let isMouseDown = false;
    // let isMouseDown = false;
    // outputs a pixel to the display canvas (does not save)
    const drawPixelAt = useCallback((x, y, color, drawingPixelsWidth) => {
      // don't run on empty pixels
      if (color == null) {
        return;
      }
      // calculate how big our "virtual pixels" are on the actual screen canvas pixel resolution
      const pixelSize = canvasRenderWidth / drawingPixelsWidth;
    
      // reference the canvas context for drawing to
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Draw a pixel at the clicked position
      drawPixelToCtx(context, x, y, color, pixelSize);

      // if (drawGridLines) {
      //   fixGridLinesAt(context, x, y, pixelSize, canvas.width, canvas.height);
      // }
      // else 
      if (showGridLines) {
        fixGridLinesAt(context, x, y, pixelSize, canvas.width, canvas.height);
      }
  
    });

  
    // Handles the event of someone clicking on the canvas area
    // Currently only supports single click drawing
    async function handleCanvasClick(event) {
      if (!isDrawing.current && event.type !== "mousedown") return;
      console.log('clicked');
      const canvas = canvasRef.current;

      // Get the bounding rectangle of the canvas
      const rect = canvas.getBoundingClientRect();
      
      const pixelSize = canvasRenderWidth / canvasData.width;

      // Get the position of the pixel that was clicked on
      const pixelX = Math.floor(
        (((event.clientX - rect.left) / rect.width) * canvas.width) / pixelSize
      );

      const pixelY = Math.floor(
        (((event.clientY - rect.top) / rect.height) * canvas.height) / pixelSize
      );
      let color; // Define the color for the current tool
    
      if (tool === "pencil") {
        color = brushColor;
         
      } else if (tool === "eraser") {
        color = "#00000000";
        // update the display for that pixel with clearcolor

        drawCheckeredPixel(canvas.getContext("2d"), pixelX, pixelY, pixelSize);

        console.log("erasing");
      } else if (tool === "paint") {

        const targetColor = canvasData.pixels[pixelX + pixelY  * canvasData.width];
        if (targetColor === brushColor) return; // Already filled with the same color
        floodFill(pixelX, pixelY, targetColor, brushColor);
        return;
      }else if (tool === "eyeDropper"){
      
        const color = await handleEyeDropper();
        if (color) {
        if (onColorSelected) {
          onColorSelected(color); 
        }
       }
        return;
     }else if (tool =="showGridLines"){
      toggleGrid(); 
     return;
      }
  
      // update the pixel in local storage
      setCanvasData((oldCanvas) => {
        return updatePixelAt(oldCanvas, pixelX, pixelY, color);
      });
      drawPixelAt(pixelX, pixelY, color, canvasData.width);

      // draw to the pixel on the canvas for display
      // drawPixelAt(pixelX, pixelY, color, canvasData.width);
    }

    // function handleCanvasDrag(event) {
    //   if (!isMouseDown) return;
    //   handleCanvasClick(event)
    // }

    // Flood Fill Algorithm
    const floodFill = (x, y, targetColor, replacementColor) => {
      const isBackgroundColor = "#00000000"
      if (
        targetColor === replacementColor ||
        replacementColor === isBackgroundColor
      ) {
        return;
      }

      const stack = [[x, y]];
      const visited = new Set();
      const width = canvasData.width;
      const height = canvasData.height;

      const getPixelIndex = (x, y) => x + y * width;

      while (stack.length > 0) {
        const [currentX, currentY] = stack.pop();
        const index = getPixelIndex(currentX, currentY);

        // Skip if out of bounds or already visited
        if (
          currentX < 0 ||
          currentX >= width ||
          currentY < 0 ||
          currentY >= height ||
          visited.has(index) ||
          canvasData.pixels[index] !== targetColor
        ) {
          continue;
        }

        // Fill the current pixel
        visited.add(index);
        setCanvasData((oldCanvas) =>
          updatePixelAt(oldCanvas, currentX, currentY, replacementColor)
        );
        drawPixelAt(currentX, currentY, replacementColor, width);

        // Add neighbors to the stack
        stack.push([currentX + 1, currentY]);
        stack.push([currentX - 1, currentY]);
        stack.push([currentX, currentY + 1]);
        stack.push([currentX, currentY - 1]);
      }
    
    };

    useEffect(() => {
      console.log("Canvas data updated:", canvasData);
    }, [canvasData]);
    
   

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawCheckeredBackground(
          context,
          canvasData.width * 2,
          canvasData.height * 2,
          canvas.width,
          canvas.height
        );
        canvasData.pixels.forEach((color, index) => {
          const x = index % canvasData.width;
          const y = Math.floor(index / canvasData.width);
          drawPixelToCtx(context, x, y, color, canvas.width / canvasData.width);
        });
        drawAllGridLines(canvas, canvasData.width, canvasData.height);
      }
    }, [canvasData, showGridLines]);
    
    // forward the draw single pixel function for efficiency
    useImperativeHandle(
      ref,
      () => {
        return {
          // export ability to draw at a pixel
          drawPixelAt,
          // export the load canvas
          tryLoadCanvas,
          // export the clear canvas function
          clearCanvas,
          canvasRef,
        };
      },
      [clearCanvas, drawPixelAt, tryLoadCanvas]
    );

    //
    // Hooks
    //
   
    // On Load
    useEffect(() => {
      tryLoadCanvas(canvasData);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //   console.log("canvas contents resized or changed");
    //   // tryLoadCanvas(canvasData);
    // }, [canvasData]);

    return (
      <>
        <canvas
          className="editor-canvas"
          ref={canvasRef}
          width={canvasRenderWidth}
          height={canvasRenderHeight}
          onMouseDown={(e) => {
          isDrawing.current = true;
          handleCanvasClick(e);
        }}
        onMouseMove={handleCanvasClick}
        onMouseUp={() => {
          isDrawing.current = false;
        }}
        onMouseLeave={() => {
          isDrawing.current = false;
        }}
        ></canvas>
      </>
    );
  }
);

export default Canvas;
