import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";

import "../css/Canvas.css";
import {
  drawCheckeredBackground,
  drawPixelToCtx,
  drawCheckeredPixel,
  parseColor
} from "../utils";

const Canvas = forwardRef(
  (
    {
      canvasData,
      setCanvasData,
      canvasRenderWidth = 128, // determines the actual rendering of the pixels to the screen (including editor lines)
      canvasRenderHeight = 128,
      brushColor = "blue",
      gridLinesVisible,
      gridLineWidth = 1,
      gridLineColor = "#000000",
      tool,
      onColorSelected
    },
    ref
  ) => {
    //
    // State
    //

    // reference to the canvas object for us to draw to
    const canvasRef = useRef(null);

    // a list of batch updates to be applied to the canvas by a drag event
    const pixelUpdatesRef = useRef([]);

    // helper to make use state update of array cleaner looking
    const queuePixelUpdate = (x, y, color) => {
      if (!pixelUpdatesRef.current) {
        pixelUpdatesRef.current = [];
      }
      pixelUpdatesRef.current.push({ x, y, color });
      // setPixelUpdates((prevUpdates) => [...prevUpdates, { x: x, y: y, color }]);
    };

    const clearPixelUpdates = () => {
      pixelUpdatesRef.current = [];
    }

    // track drag state
    let isMouseDown = useRef(false);

    // how big a single pixel is on the actual rendering canvas:
    // this should be calculated on demand
    // const pixelSize = canvasRenderWidth / canvasData.width;

    // updates the state of a pixel at specific coordinate
    // on the provided canvas data and returns it
    const updatePixelAt = (oldCanvas, x, y, color) => {

      // console.log(`updatePixelAt called with  ${oldCanvas} ${x} ${y} ${color}`);

      // don't allow out of bounds access
      if (x >= oldCanvas.width || y >= oldCanvas.height) {
        // console.error(
        //   `X ${x} Y ${y} is out of bounds in canvas of size: {${x}, ${y}}`
        // );
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
      if (!gridLinesVisible) return;
      // draw all grid lines on the canvas
      const context = canvas.getContext("2d");

      const gridSpacing = canvas.width / editorPixelsW;

      context.lineWidth = gridLineWidth;
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
        editorPixelsW * 2,
        editorPixelsH * 2,
        canvas.width,
        canvas.height
      );

      if (gridLinesVisible) {
        // draw all grid lines on the canvas
        drawAllGridLines(canvas, editorPixelsW, editorPixelsH);
      }

      if (updateDataOnClear) {
        setCanvasData((oldCanvas) => {
          // deep copy (make react update)
          let newCanvas = { ...oldCanvas };
          newCanvas.pixels = [];
          return newCanvas;
        });
      }
      // context.fill();
    });

    // attempt to load a provided canvas json representation
    // it is "try" because the loaded data can be tampered with by the user
    // or be incompatible due to updates
    const tryLoadCanvas = (canvasData, storeOnLoad = false) => {
      // console.info("loading canvas state with object: ", canvasData);
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

        if (gridLinesVisible) {
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

      if (gridLinesVisible) {
        fixGridLinesAt(context, x, y, pixelSize, canvas.width, canvas.height);
      }

    });

    const getHexColor = (canvas, x, y) => {

      const context = canvas.getContext("2d");
      const pixelData = context.getImageData(x, y, 1, 1).data;
      const r = pixelData[0];
      const g = pixelData[1];
      const b = pixelData[2];

      const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase()}`;

      return hexColor;
    };

    // Handles the event of someone clicking on the canvas area
    // Currently only supports single click drawing
    async function handleCanvasClick(event) {
      const canvas = canvasRef.current;

      // Get the bounding rectangle of the canvas
      const rect = canvas.getBoundingClientRect();

      const pixelSize = canvasRenderWidth / canvasData.width;

      // prevent events outside of the canvas
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        return;
      }

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

        // console.log("erasing");
      } else if (tool === "paint") {
        // "Bucket" Fill the area with the brush color
        const targetColor = canvasData.pixels[pixelX + pixelY * canvasData.width];
        // if (targetColor === brushColor) return; // Already filled with the same color
        floodFill(pixelX, pixelY, targetColor, brushColor);
        return;
      } else if (tool === "eyedropper") {
        // this gets the color from the "rendered" canvas which includes gridlines
        const hexColor = getHexColor(canvas, pixelX * pixelSize, pixelY * pixelSize);
        // instead we should get the color from the actual underlying canvasData state
        // but the color picker in html doesn't support transparency yet https://github.com/whatwg/html/issues/3400
        // so we have to replace the current color picker before we can do this
        // const hexColor = canvasData.pixels[pixelX + pixelY * canvasData.width];
        // console.log("colorrrr", hexColor)
        if (onColorSelected) {
          // console.log("colorrrr", hexColor)
          onColorSelected(hexColor);
        }
        return;

      }
      else {
        // do nothing if no tool
        console.warn("No tool selected"); // this shouldn't happen
        return;
      }

      // update the pixel in local storage
      // setCanvasData((oldCanvas) => {
      //   return updatePixelAt(oldCanvas, pixelX, pixelY, color);
      // });
      // queue the pixel for update instead
      queuePixelUpdate(pixelX, pixelY, color);
      // draw to the pixel on the canvas for display
      drawPixelAt(pixelX, pixelY, color, canvasData.width);
    }


    // Interpolation logic using Bresenham's line algorithm
    function interpolate(start, end, drawFunction) {
      const dx = Math.abs(end.x - start.x);
      const dy = Math.abs(end.y - start.y);
      const sx = start.x < end.x ? 1 : -1;
      const sy = start.y < end.y ? 1 : -1;
      let err = dx - dy;

      while (true) {
        // Create a synthetic event for the interpolated point
        const syntheticEvent = new MouseEvent('mousemove', {
          clientX: start.x,
          clientY: start.y,
        });

        // Call the draw function with the synthetic event
        drawFunction(syntheticEvent);

        // end interpolation if we reached the end point
        if (start.x === end.x && start.y === end.y) break;
        const e2 = err * 2;
        if (e2 > -dy) {
          err -= dy;
          start.x += sx;
        }
        if (e2 < dx) {
          err += dx;
          start.y += sy;
        }
      }
    }

    // store the last position of the mouse for interpolation
    let oldPos = null;
    // how many times to draw between last and current position
    const interpolationResolution = 16;
    // Handles the event of someone dragging the mouse (or their finger) on the canvas area
    async function handleCanvasDrag(event) {
      if (event.type === "touchmove") {
        const touch = event.touches[0];
        // inject mobile touch event coordinates to same structure as mouse event
        event.clientX = touch.clientX;
        event.clientY = touch.clientY;
      }
      // console.log(`OldPos: ${JSON.stringify(oldPos)} currentPos: ${event.clientX} ${event.clientY}`);
      if (!isMouseDown.current) return;

      await handleCanvasClick(event);

      // draw extra pixels between the last and current position
      if (oldPos) {
        interpolate(oldPos, { x: event.clientX, y: event.clientY }, handleCanvasClick);
        // // Get the vector between the last and current cursor position
        // const diff = { x: event.clientX - oldPos.x, y: event.clientY - oldPos.y };
        // const step = { x: diff.x / interpolationResolution, y: diff.y / interpolationResolution };

        // // in the future the resolution to interpolate with could be determined by this:
        // // const dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);

        // // simulate extra clicks between the last and current cursor position
        // for (let i = 0; i < interpolationResolution; i++) {
        //   const x = oldPos.x + step.x * i;
        //   const y = oldPos.y + step.y * i;
        //   event.clientX = x;
        //   event.clientY = y;
        //   await handleCanvasClick(event);
        // }
      }

      oldPos = { x: event.clientX, y: event.clientY };
    }


    // Handles the event of someone clicking on the canvas area
    function initDrag(e) {
      oldPos = null;
      isMouseDown.current = true;
      handleCanvasClick(e);
    }

    // Handles the event of someone releasing the mouse button
    function endDrag() {
      oldPos = null;
      isMouseDown.current = false;
      // apply all queued pixel updates 
      applyPixelUpdates();
      
    }

    const applyPixelUpdates = () => {
      if (!pixelUpdatesRef.current || pixelUpdatesRef.current.length <= 0) {
        return;
      }
      setCanvasData((oldCanvas) => {
        let newCanvas = { ...oldCanvas };
        pixelUpdatesRef.current.forEach(({ x, y, color }) => {
          newCanvas = updatePixelAt(newCanvas, x, y, color);
        });
        clearPixelUpdates();
        return newCanvas;
      });
    };

    // Flood Fill Algorithm
    function floodFill(x, y, targetColor, replacementColor) {
      const isBackgroundColor = "#00000000"
      if (
        // targetColor === replacementColor ||
        replacementColor === isBackgroundColor ||
        replacementColor == null
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
          visited.has(index)
          // || canvasData.pixels[index] !== targetColor
        ) {

          continue;
        }

        // compare the distance between the target color and the current color
        // using a distance formula
        const minDistance = 0.002;

        var [r, g, b, a] = parseColor(canvasData.pixels[index])
        var [tr, tg, tb, ta] = parseColor(targetColor);

        [r, g, b, a] = [r, g, b, a].map(x => x / 255.0);
        [tr, tg, tb, ta] = [tr, tg, tb, ta].map(x => x / 255.0);

        const distanceSquared = (r - tr) * (r - tr) + (g - tg) * (g - tg) + (b - tb) * (b - tb);// + (a - ta) * (a - ta);

        if (distanceSquared > minDistance) {
          continue;
        }

        // Fill the current pixel
        visited.add(index);
        // setCanvasData((oldCanvas) =>
        //   updatePixelAt(oldCanvas, currentX, currentY, replacementColor)
        // );
        queuePixelUpdate(currentX, currentY, replacementColor);
        drawPixelAt(currentX, currentY, replacementColor, width);

        // Add neighbors to the stack
        stack.push([currentX + 1, currentY]);
        stack.push([currentX - 1, currentY]);
        stack.push([currentX, currentY + 1]);
        stack.push([currentX, currentY - 1]);
      }
      // console.log("Flood Fill Complete ", pixelUpdatesRef.current);
      applyPixelUpdates();
    };

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
        if (gridLinesVisible) drawAllGridLines(canvas, canvasData.width, canvasData.height);
      }
    }, [canvasData, gridLinesVisible]);

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
          onMouseDown={initDrag}
          onMouseMove={handleCanvasDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchMove={handleCanvasDrag}
          onTouchStart={initDrag}
          onTouchCancel={endDrag}
          onTouchEnd={endDrag}
        ></canvas>
      </>
    );
  }
);

export default Canvas;
