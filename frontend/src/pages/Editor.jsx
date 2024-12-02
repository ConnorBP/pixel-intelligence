import { useRef } from "react";
import Canvas from "../components/Canvas";
import EditorLeftToolBar from "../components/EditorLeftToolBar";
import EditorTopBar from "../components/EditorTopBar";
import "../css/EditorPageCSS/Editor.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { SimpleImage, DownScaler, RGBAToHex } from "../utils/index";

const Editor = () => {
  // brush colors are stored as html color codes
  const [brushColor, setBrushColor] = useLocalStorage("primaryBrushColor", "#000000");
  const [secondaryBrushColor, setSecondaryBrushColor] = useLocalStorage("secondaryBrushColor", "#FFFFFF");
  // we will store the canvas size as an object of width and height in case we decide to remove the square restriction
  // const [canvasSize, setCanvasSize] = useLocalStorage("canvasSize", { width: 16, height: 16 });
  const nav = useNavigate();
  const pixelCanvasRef = useRef(null);
  // how many pixels can actually be used on the screen to render the canvas object (for grid lines between pixels etc)
  const CANVAS_RENDER_WIDTH = 256;

  // default canvas storage object
  // NOTE: once we deploy, we cannot change this without breaking users localstorage
  // so keep this consistent
  const defaultCanvas = {
    width: 32,
    height: 32,
    // pixels are stored in one array.
    // pixels are stored left to right then top down
    pixels: [],
  };
  // canvas pixel data
  const [canvasData, setCanvasData] = useLocalStorage("canvas", defaultCanvas);

  // file picker
  const imageFileInputRef = useRef(null);

  async function toBase64(file) {
    return new Promise((resolve, reject) => {
      if (!FileReader) {
        reject("no file reader support");
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const handleImageLoad = async (event) => {
    const target = event.target;
    const files = target.files;
    // get the first image selected by file-picker
    const base64 = await toBase64(files[0]);

    // now process it into the canvas if possible

    var img = new Image();
    img.onload = function () {
      console.log('loading image');
      // create a temporary canvas element not on the dom for processing the image
      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = img.width;
      tmpCanvas.height = img.height;
      const ctx = tmpCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      // console.log(ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height));
      try {
        // might throw
        console.log(`new canvas width and height ${tmpCanvas.width}, ${tmpCanvas.height}`);
        const simp = new SimpleImage({ imageData: ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height) });
        let { kCentroid } = DownScaler.kCenter(simp, canvasData.width, canvasData.height, 16, 16);

        const newCanvasData = {
          pixels: kCentroid.pixels.map(({ r, g, b, a }) => {
            // console.log(`${r} ${g} ${b} ${a}`);
            return RGBAToHex(r, g, b, a)
          }),
          width: canvasData.width,
          height: canvasData.height,
        };
        setCanvasData(newCanvasData);

        if (pixelCanvasRef.current) {
          pixelCanvasRef.current.tryLoadCanvas(newCanvasData);
        }

        console.log('import complete');


      } catch (err) {
        console.error('failed to process image: ', err);
      }

    }

    img.src = base64;
  };

  const handleResize = (newSize) => {
    if (newSize == canvasData.width) {
      // no need to waste resources if its the same size already
      // this assumes square canvas only mode
      return;
    }
    // check the ref to the canvas ref (this looks silly i know)
    if (pixelCanvasRef.current && pixelCanvasRef.current.canvasRef.current) {
      try {
        const ctx = pixelCanvasRef.current.canvasRef.current.getContext("2d");
        const simp = new SimpleImage({ imageData: ctx.getImageData(0, 0, CANVAS_RENDER_WIDTH, CANVAS_RENDER_WIDTH) });
        let { kCentroid } = DownScaler.kCenter(simp, newSize, newSize, 16, 16);
        const newCanvasData = {
          pixels: kCentroid.pixels.map(({ r, g, b, a }) => {
            // console.log(`${r} ${g} ${b} ${a}`);
            return RGBAToHex(r, g, b, a);
          }),
          width: newSize,
          height: newSize,
        };
        // setCanvasData(newCanvasData);
        pixelCanvasRef.current.tryLoadCanvas(newCanvasData, true);
      } catch (err) {
        console.error('resize canvas failed', err);
      }
    }
  };

  const onImportImageClicked = () => {
    if (imageFileInputRef.current) {
      imageFileInputRef.current.click();
    }
  };

  const contextMenuOptions = [
    { text: "New Drawing", onClick: () => alert('todo') },
    { text: "Open", onClick: () => alert('todo: open a json document') },
    { text: "View Gallery", onClick: () => nav("/") },
    { text: "Share", onClick: () => alert('todo') },
    { text: "Import Image", onClick: onImportImageClicked },
    { text: "Download", onClick: () => alert('todo') },
  ];

  return (
    <div className="editor-container">
      <EditorTopBar
        contextMenuOptions={contextMenuOptions}
        onImportImageClicked={onImportImageClicked}
        currentCanvasSize={canvasData.width}
        onResizeImageRequested={handleResize}
      />
      <EditorLeftToolBar
        selectedColor={brushColor}
        setSelectedColor={setBrushColor}
        secondaryColor={secondaryBrushColor}
        setSecondaryColor={setSecondaryBrushColor}
      />
      <div className="canvas-container">
        <Canvas brushColor={brushColor} canvasData={canvasData} setCanvasData={setCanvasData} ref={pixelCanvasRef} canvasRenderWidth={CANVAS_RENDER_WIDTH} canvasRenderHeight={CANVAS_RENDER_WIDTH} />
      </div>
      <input
        type="file"
        id="imgFileElem"
        // multiple
        accept="image/*"
        className="hidden"
        onChange={handleImageLoad}
        ref={imageFileInputRef}
      />
    </div>
  );
};

export default Editor;
