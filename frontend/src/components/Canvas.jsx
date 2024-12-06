import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "../css/Canvas.css";
import { drawCheckeredBackground } from "../utils";
import { drawCheckeredPixel } from "../utils";
// eslint-disable-next-line react/display-name
const Canvas = forwardRef(
  (
    {
      canvasData,
      setCanvasData,
      canvasRenderWidth = 128, // determines the actual rendering of the pixels to the screen (including editor lines)
      canvasRenderHeight = 128,
      brushColor = "blue",
      tool = "eraser",
    },
    ref
  ) => {
    //
    // State
    //

    // reference to the canvas object for us to draw to
    const canvasRef = useRef(null);
    // automatically keeps track of canvas state on the browser storage

    // how big a single pixel is on the actual rendering canvas:
    // this should be calculated on demand
    // const pixelSize = canvasRenderWidth / canvasData.width;

    // updates the state of a pixel at specific coordinate
    // on the provided canvas data and returns it
    // const updatePixelAt = (oldCanvas, x, y, color,) => {
    //   // console.log("setCanvas called with ", oldCanvas);
    //   // don't allow out of bounds access
    //   if (x >= oldCanvas.width || y >= oldCanvas.height) {
    //     console.error(
    //       `X ${x} Y ${y} is out of bounds in canvas of size: {${x}, ${y}}`
    //     );
    //     return oldCanvas;
    //   }
    //   const newCanvas = { ...oldCanvas };
    //   // insert pixel at x position starting at row base (y*width)
    //   newCanvas.pixels[x + y * newCanvas.width] = color;
    //   // console.log("returning from setCanvas with ", newCanvas);

    //   return newCanvas;
    // };

    const updatePixelAt = (oldCanvas, x, y, color) => {
      console.log("Updating pixel at:", { x, y, color });
      if (x >= oldCanvas.width || y >= oldCanvas.height) {
        console.error(
          `X ${x} Y ${y} is out of bounds in canvas of size: {${oldCanvas.width}, ${oldCanvas.height}}`
        );
        return oldCanvas;
      }
      const newCanvas = { ...oldCanvas };
      const index = x + y * newCanvas.width;
      newCanvas.pixels[index] = color;
      console.log("Updated canvas at index:", index, "with color:", color);
      return newCanvas;
    };

    // clears the canvas with a background grid
    const clearCanvas = (canvas, editorPixelsW, editorPixelsH) => {
      const context = canvas.getContext("2d");
      context.fillStyle = "#2c2f33";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#1e2124";
      drawCheckeredBackground(
        context,
        editorPixelsW * 2,
        editorPixelsH * 2,
        canvas.width,
        canvas.height
      );
      // context.fill();
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
      } catch (err) {
        // in case of pesky bugs from errors or malicious input
        console.error("Failed to load canvas data. Unexpected Error: ", err);
        return false;
      }
      // if nothing failed by here, it was a great success :)
      return true;
    };

    let isMouseDown = false;
    // outputs a pixel to the display canvas (does not save)
    const drawPixelAt = (x, y, color, drawingPixelsWidth) => {
      // don't run on empty pixels
      if (color == null) {
        return;
      }

      const pixelSize = canvasRenderWidth / drawingPixelsWidth;

      const canvasX = x * pixelSize;
      const canvasY = y * pixelSize;

      // reference the canvas context for drawing to
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      // const centerX = x + pixelSize / 2;
      // const centerY = y + pixelSize / 2;

      // Draw a pixel at the clicked position
      context.fillStyle = color;
      // context.beginPath();
      // context.arc(centerX, centerY, pixelSize/2, 0, 2 * Math.PI); // Draw a circle with radius 10
      context.fillRect(canvasX, canvasY, pixelSize, pixelSize);

      // context.fill();
    };

    // Handles the event of someone clicking on the canvas area
    // Currently only supports single click drawing

    const handleCanvasClick = (event) => {
      if (!isMouseDown) return;

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

      if (
        pixelX < 0 ||
        pixelY < 0 ||
        pixelX >= canvasData.width ||
        pixelY >= canvasData.height
      ) {
        console.error(`Invalid pixel coordinates: (${pixelX}, ${pixelY})`);
        return;
      }

      let color; // Define the color for the current tool

      if (tool === "pencil") {
        // 연필 도구
        color = brushColor;
        drawPixelAt(pixelX, pixelY, color, canvasData.width);

        // Save to state
        setCanvasData((oldCanvas) =>
          updatePixelAt(oldCanvas, pixelX, pixelY, color)
        );
      } else if (tool === "eraser") {
        const checkeredColor =
          (pixelX + pixelY) % 2 === 0 ? "#2c2f33" : "#1e2124";
        drawPixelAt(pixelX, pixelY, checkeredColor, canvasData.width);

        setCanvasData((oldCanvas) =>
          updatePixelAt(oldCanvas, pixelX, pixelY, checkeredColor)
        );
      } else if (tool === "clear") {
        //visually clear the canvas on the editor
        clearCanvas(canvasRef.current, canvasData.width, canvasData.height);

        return;
      } else if (tool === "paint") {
        const targetColor =
          canvasData.pixels[pixelX + pixelY * canvasData.width];
        if (targetColor === brushColor) return; // Already filled with the same color

        // Perform flood fill
        floodFill(pixelX, pixelY, targetColor, brushColor);
      }
    };

    // Flood Fill Algorithm
    const floodFill = (x, y, targetColor, replacementColor) => {
      if (targetColor === replacementColor) return;

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
    const setupCanvasEvents = () => {
      const canvas = canvasRef.current;

      canvas.addEventListener("mousedown", () => {
        isMouseDown = true;
      });

      canvas.addEventListener("mouseup", () => {
        isMouseDown = false;
      });

      canvas.addEventListener("mousemove", handleCanvasClick);
    };

    useEffect(() => {
      setupCanvasEvents();
      return () => {
        const canvas = canvasRef.current;
        canvas.removeEventListener("mousedown", () => {});
        canvas.removeEventListener("mouseup", () => {});
        canvas.removeEventListener("mousemove", handleCanvasClick);
      };
    }, [tool, brushColor, canvasData.width]);

    useImperativeHandle(
      ref,
      () => {
        return {
          drawPixelAt,
          tryLoadCanvas,
          canvasRef,
        };
      },
      [canvasRef]
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
          onClick={handleCanvasClick}
        ></canvas>
      </>
    );
  }
);

export default Canvas;
