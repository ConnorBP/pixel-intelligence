import { useRef, useEffect } from "react";
import "./Canvas.css";

const Canvas = ({ pixelWidth = 16, pixelHeight = 16, elementWidth = 64, elementHeight = 64 }) => {
  const canvasRef = useRef(null);

  // onload
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set up initial canvas properties (optional)
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Get the bounding rectangle of the canvas
    const rect = canvas.getBoundingClientRect();

    const pixelSize = rect.width / pixelWidth;

    // Get the center position of the pixel that was clicked on
    const x = Math.floor((event.clientX - rect.left) / rect.width * canvas.width / pixelSize) * pixelSize + pixelSize / 2;
    const y = Math.floor((event.clientY - rect.top) / rect.height * canvas.height / pixelSize) * pixelSize + pixelSize / 2;

    // Draw a circle at the clicked position
    context.fillStyle = "blue";
    context.beginPath();
    context.arc(x, y, pixelSize/2, 0, 2 * Math.PI); // Draw a circle with radius 10
    context.fill();
  };

  useEffect(() => {
    console.log("canvas resized");
  }, [pixelWidth, pixelHeight]);

  return (
    <>
      <canvas
        className="pixel-canvas"
        ref={canvasRef}
        width={elementWidth}
        height={elementHeight}
        onClick={handleCanvasClick}
      ></canvas>
    </>
  );
};

export default Canvas;
