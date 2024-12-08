import { useRef,useState } from "react";
import Canvas from "../components/Canvas";
import EditorLeftToolBar from "../components/EditorLeftToolBar";
import EditorTopBar from "../components/EditorTopBar";
import NewImagePopup from "../components/NewImagePopup";
import ScaleImagePopup from "../components/ScaleImagePopup";
import "../css/EditorPageCSS/Editor.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { SimpleImage, DownScaler, RGBAToHex, ExportPng, DownloadJson } from "../utils/index";

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
  // wether the grid lines are shown or not on the editor canvas
  const [gridLinesVisible, setGridLinesVisible] = useLocalStorage("gridLinesVisible", true);
  const [tool, setTool] = useLocalStorage("tool", "pencil");
  // file pickers
  // actual element is defined at the bottom of the file
  // this ref lets react refer to the element on the dom
  const imageFileInputRef = useRef(null);
  const jsonFileInputRef = useRef(null);

  // popup state tracking
  const [showNewImagePrompt, setShowNewImagePrompt] = useState(false);
  const [showResizePrompt, setShowResizePrompt] = useState(false);

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
      // console.log('loading image data:', ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height));
      try {
        // might throw
        console.log(`new canvas width and height ${tmpCanvas.width}, ${tmpCanvas.height}`);
        const simp = new SimpleImage({ imageData: ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height) });
        // this applies the k-means clustering centroid based downscaling algorithm to the image with 4 buckets and 10 iterations
        let { kCentroid } = DownScaler.kCenter(simp, canvasData.width, canvasData.height, 4, 10);

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

  const handleProjectDocumentLoad = async (event) => {
    const target = event.target;
    const files = target.files;
    // get the first image selected by file-picker
    // console.log(files[0]);
    try {
      const reader = new FileReader();
      reader.onload = function (e) {
        // console.log('file read');
        // console.log(e.target.result);
        const json = JSON.parse(e.target.result);
        // console.log(json);
        setCanvasData(json);
        if (pixelCanvasRef.current) {
          // now attempt to load it to the canvas
          pixelCanvasRef.current.tryLoadCanvas(json);
        }
      };
      reader.readAsText(files[0]);
    } catch (err) {
      console.error('failed to load project document', err);
    }
  };

  // takes in a new square resolution and scales the current canvas data to it
  // warning: must be a function, and not a const closure
  // or else react will be stupid and not update canvasData state for it
  function handleResize(newSize) {
    if (newSize == canvasData.width) {
      // no need to waste resources if its the same size already
      // this assumes square canvas only mode
      return;
    }

    // check the ref to the canvas ref (this looks silly i know)
    if (pixelCanvasRef.current) {
      try {
        // const ctx = pixelCanvasRef.current.canvasRef.current.getContext("2d");
        // this feeds the resize data with the current canvas output (not ideal when you have grid lines):
        // const simp = new SimpleImage({ imageData: ctx.getImageData(0, 0, CANVAS_RENDER_WIDTH, CANVAS_RENDER_WIDTH) });
        // instead we initialize a simple image from our orignal document pixels data
        const simp = new SimpleImage({ fromCanvasData: canvasData });


        let pixels;
        // use a different algorithm for up-scaling
        // this stupid ass thing does a string comparison half the time without parse int
        // and this is why javascript is a stupid language
        if (parseInt(newSize) > parseInt(canvasData.width)) {
          // console.log(`up-scaling from ${canvasData.width} to ${newSize}`);
          pixels = DownScaler.resizeNN(simp, newSize, newSize).pixels;
        } else {
          // console.log(`down-scaling from ${canvasData.width} to ${newSize}`, simp);
          let { kCentroid } = DownScaler.kCenter(simp, newSize, newSize, 16, 16);
          pixels = kCentroid.pixels;
          // console.log('done: ', pixels);
        }

        const newCanvasData = {
          pixels: pixels.map(({ r, g, b, a }) => {
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
  }

  const handleCreateNewImageConfirmed = (newImage) => {
    console.log("New Canvas Created:", newImage);
  };

  const onImportImageClicked = () => {
    if (imageFileInputRef.current) {
      // reset the file input before prompting for file selection
      // so we don't get old input
      imageFileInputRef.current.value = null;
      // simulate a click to the hidden file input component to prompt for an image file selection
      imageFileInputRef.current.click();
    }
  };

  const onImportProjectClicked = () => {
    if (jsonFileInputRef.current) {
      // reset the file input before prompting for file selection
      // so we don't get old input
      jsonFileInputRef.current.value = null;
      // simulate a click to the hidden file input component to prompt for an image file selection
      jsonFileInputRef.current.click();
    }
  };

  // warning: must be a function, and not a const closureß
  // or else react will be stupid and not update canvasData state for it
  function onExportDownloadClicked() {
    if (!ExportPng(canvasData)) {
      console.log('image export failed');
      alert('image export failed');
    }
  };

  function onTrashClearClicked() {
    // this is ugly, api should be adjusted
    if (pixelCanvasRef.current && pixelCanvasRef.current.canvasRef.current) {
      pixelCanvasRef.current.clearCanvas(pixelCanvasRef.current.canvasRef.current, canvasData.width, canvasData.height, true);
    }

  }
  // download the latest canvas data json
  function onSaveClicked() {
    if (!DownloadJson(canvasData)) {
      console.log('project download failed');
      alert('project download failed');
    }
  }

  const onCreateNewImageClicked = () => {
    setShowNewImagePrompt(true);
  };

  const onShareCurrentCanvasClicked = () => {
    alert('todo');
  };

  const onResizeImageClicked = () => {
    setShowResizePrompt(true);
  };
  const handleEyeDropperColor = (color) => {
    console.log("color from canvas:", color); 
    setBrushColor(color); 
  };
  const contextMenuOptions = [
    { text: "New Project", onClick: onCreateNewImageClicked },
    { text: "Save", onClick: onSaveClicked },
    { text: "Open", onClick: onImportProjectClicked },

    { text: "Import Image", onClick: onImportImageClicked },
    { text: "Export Image", onClick: onExportDownloadClicked },

    { text: "Resize Canvas", onClick: onResizeImageClicked },

    { text: "Share", onClick: onShareCurrentCanvasClicked },
    { text: "View Gallery", onClick: () => nav("/") },
  ];

  return (
    <div className="editor-container">
      <NewImagePopup
        isOpen={showNewImagePrompt}
        onClose={() => { setShowNewImagePrompt(false) }}
        onCreate={(newImage) => {
          handleCreateNewImageConfirmed(newImage);
          setShowNewImagePrompt(false);
        }}
      />
      <ScaleImagePopup isOpen={showResizePrompt} setIsOpen={setShowResizePrompt} onConfirm={handleResize} currentCanvasSize={canvasData.width} />
      <EditorTopBar
        contextMenuOptions={contextMenuOptions}
        onImportImageClicked={onImportImageClicked}
        currentCanvasSize={canvasData.width}
        onResizeImageClicked={onResizeImageClicked}
        onImageExportClicked={onExportDownloadClicked}
        onSaveClicked={onSaveClicked}
        onTrashClearClicked={onTrashClearClicked}
        onImportProjectClicked={onImportProjectClicked}
        onCreateNewImageClicked={onCreateNewImageClicked}
        onShareCurrentCanvasClicked={onShareCurrentCanvasClicked}
      />
      <EditorLeftToolBar
        selectedColor={brushColor}
        setSelectedColor={setBrushColor}
        secondaryColor={secondaryBrushColor}
        setSecondaryColor={setSecondaryBrushColor}
        tool={tool}
        setTool={setTool}

      />
      <div className="canvas-container">
        <Canvas
          brushColor={brushColor}
          canvasData={canvasData}
          setCanvasData={setCanvasData}
          ref={pixelCanvasRef}
          canvasRenderWidth={CANVAS_RENDER_WIDTH}
          canvasRenderHeight={CANVAS_RENDER_WIDTH}
          gridLinesVisible={gridLinesVisible}
          tool={tool}
          onColorSelected={handleEyeDropperColor} 
        />
      </div>
      {/* Hidden file input for opening images */}
      <input
        type="file"
        id="imgFileElem"
        // multiple
        accept="image/*"
        className="hidden"
        onChange={handleImageLoad}
        ref={imageFileInputRef}
      />
      {/* Hidden file input for opening json files */}
      <input
        type="file"
        id="projectFileElem"
        // multiple
        accept="application/json"
        className="hidden"
        onChange={handleProjectDocumentLoad}
        ref={jsonFileInputRef}
      />
    </div>
  );
};

export default Editor;
