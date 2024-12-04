import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "../css/Canvas.css";
import { drawCheckeredBackground } from "../utils";

// eslint-disable-next-line react/display-name
const Canvas = forwardRef(
  (
    {
      canvasData,
      setCanvasData,
      canvasRenderWidth = 128, // determines the actual rendering of the pixels to the screen (including editor lines)
      canvasRenderHeight = 128,
      brushColor = "blue",
      tool = "pencil",

    },
    ref
  ) => {
    //
    // State
    //

    // reference to the canvas object for us to draw to
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawing, setDrawing] = useLocalStorage("drawing", "");
    useEffect(() => {
      if (drawing) {
        const image = new Image();
        image.src = drawing;
        image.onload = () => {
          contextRef.current.drawImage(image, 0, 0); 
        };
      }
    }, [drawing]);
    // Initialize canvas and context
    
    const clearCanvas = (canvas, editorPixelsW, editorPixelsH) => {
      const context = canvas.getContext("2d");
      context.fillStyle = "#2c2f33";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#1e2124";
      drawCheckeredBackground(context, editorPixelsW * 2, editorPixelsH * 2, canvas.width, canvas.height);
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      canvas.width = canvasRenderWidth;
      canvas.height = canvasRenderHeight;

      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 1; // Default pencil size
      contextRef.current = context;
      clearCanvas(canvas, 16, 16);
      tryLoadCanvas(canvasData);
    }, [canvasData, canvasRenderWidth, canvasRenderHeight]);


    const startDrawing = ({ nativeEvent }) => {
      const { offsetX, offsetY } = getMousePosition(nativeEvent);
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    };


    const draw = (event) => {
      if (!isDrawing) return;

      const { offsetX, offsetY } = getMousePosition(event);
      const context = contextRef.current;
  
      if (tool === "pencil") {
        context.lineWidth = 1; 
        context.globalCompositeOperation = "source-over"; // Normal drawing
        context.strokeStyle = brushColor;
        context.lineTo(offsetX, offsetY);
        context.stroke();
    
      } else if (tool === "eraser") {
      
        context.strokeStyle = "#ffffff"; // Eraser uses white color
        context.lineWidth = 10; // Eraser size
        context.lineTo(offsetX, offsetY);
        context.stroke();

      }else if(tool === "clear")
      {
        clearCanvas(canvasRef.current, 16, 16)
      }
      else if (tool === "paint"){
      
      const pixelX = Math.floor(offsetX / (canvasRenderWidth / 16)); // Adjust grid size
      const pixelY = Math.floor(offsetY / (canvasRenderHeight / 16)); // Adjust grid size
      drawPixelAt(pixelX, pixelY, brushColor, 16);
   
      }
      else if (tool === "brush"){
        
        context.globalCompositeOperation = "source-over"; // Normal drawing
        context.strokeStyle = brushColor;
        context.lineTo(offsetX, offsetY);
        context.lineWidth = 10; 
        context.stroke();
        setCanvasData((oldCanvas) =>
          updatePixelAt(oldCanvas, offsetX, offsetY,brushColor)
        );
      }
    };

    // Stop drawing
    const finishDrawing = () => {
      if (!canvasRef.current) {
        console.error("Canvas is not initialized!");
        return;
      }
    
      setIsDrawing(false);
      const canvas = canvasRef.current;
      
      const dataURL = canvas.toDataURL();
    setDrawing(dataURL);
 
    };
    

    const getMousePosition = (event) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const offsetX = (event.clientX - rect.left) * scaleX;
      const offsetY = (event.clientY - rect.top) * scaleY;
    
      return { offsetX, offsetY };
    };

    const updatePixelAt = (oldCanvas, x, y, color) => {
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
    };

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
          canvasData.width !== canvasData.height // only accept square canvas
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
          console.error("Rendering canvas component was null");
          return false;
        }

        if (
          !canvasData.pixels ||
          !canvasData.pixels.length ||
          canvasData.pixels.length <= 0
        ) {
          console.info("loaded empty canvas");
          return true;
        }

        if (canvasData.pixels.length > canvasData.width * canvasData.height) {
          console.warn(
            "pixels array was larger than the canvas resolution. Truncating pixel data"
          );
          canvasData.pixels.length = canvasData.width * canvasData.height;
        }

        canvasData.pixels.forEach((pixel, i) => {
          const x = i % canvasData.width;
          const y = Math.floor(i / canvasData.width);
          drawPixelAt(x, y, pixel, canvasData.width);
        });

        if (storeOnLoad) {
          setCanvasData(canvasData);
        }
      } catch (err) {
        console.error("Failed to load canvas data. Unexpected Error: ", err);
        return false;
      }
      return true;
    };


    const drawPixelAt = (x, y, color, drawingPixelsWidth) => {
      if (!color) return;

      const pixelSize = canvasRenderWidth / drawingPixelsWidth;

      const canvasX = x * pixelSize;
      const canvasY = y * pixelSize;

      const context = contextRef.current;
      context.fillStyle = color;
      context.fillRect(canvasX, canvasY, pixelSize, pixelSize);
    };

    useImperativeHandle(ref, () => ({
      drawPixelAt,
      tryLoadCanvas,
      canvasRef,
    }));

    useEffect(() => {
      tryLoadCanvas(canvasData);
    }, []);

    return (
      <>
        <canvas
          className="editor-canvas"
          ref={canvasRef}
          width={canvasRenderWidth}
          height={canvasRenderHeight}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          
        ></canvas>
      </>
    );
  }
);

export default Canvas;

