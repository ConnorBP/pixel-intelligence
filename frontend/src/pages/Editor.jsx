import { useRef, useState, useEffect } from "react";
import Canvas from "../components/Canvas";
import EditorLeftToolBar from "../components/EditorLeftToolBar";
import EditorTopBar from "../components/EditorTopBar";
import NewImagePopup from "../components/NewImagePopup";
import ShareImagePopUp from "../components/ShareImagePopup";
import ScaleImagePopup from "../components/ScaleImagePopup";
import ConfirmationPopup from "../components/ConfirmationPopup";
import "../css/EditorPageCSS/Editor.css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate, useLocation } from "react-router-dom";
import { SimpleImage, DownScaler, RGBAToHex, ExportPng, DownloadJson, handleEyeDropper } from "../utils/index";
import { uploadToGallery } from "../api";
import generateImage from "../api/generateImage";
import useJobWatcher from "../context/useJobWatcher";
import SizeSelector from "../components/SizeSelector";

const Editor = () => {
  // brush colors are stored as html color codes
  const [brushColor, setBrushColor] = useLocalStorage("primaryBrushColor", "#000000");
  const [secondaryBrushColor, setSecondaryBrushColor] = useLocalStorage("secondaryBrushColor", "#FFFFFF");

  // navigation hook
  const nav = useNavigate();

  // for receiving an image to load from the gallery page
  const location = useLocation();
  const requestedImageLoad = location.state?.image;

  // canvas ref for the pixel canvas (wraps the actual canvas element)
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
  const [gridLinesVisible, setGridLinesVisible] = useLocalStorage("gridLinesVisible", false);
  const [tool, setTool] = useLocalStorage("tool", "pencil");
  const [previousTool, setPreviousTool] = useState(null);

  // for tracking current generation job id
  const { submitJob, clearJob, currentJobStatus, currentJobResult, canvasSize } = useJobWatcher()

  // file pickers
  // actual element is defined at the bottom of the file
  // this ref lets react refer to the element on the dom
  const imageFileInputRef = useRef(null);
  const jsonFileInputRef = useRef(null);

  // popup state tracking
  const [showNewImagePrompt, setShowNewImagePrompt] = useState(false);
  const [showResizePrompt, setShowResizePrompt] = useState(false);
  const [confirmationPopupData, setConfirmationPopupData] = useState(null);
  const [showShareImagePrompt, setShowShareImagePrompt] = useState(false);


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

  const loadBase64Image = (base64, w, h) => {
    var img = new Image();
    // img.crossOrigin = "Anonymous"; // Enable CORS so firefox will be nice
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
        const imageData = ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
        console.log('image data:', imageData);
        if (!imageData) {
          console.error('failed to load image data');
          alert('image load failed. Likely due to CORS policy blocking the image.');
          return;
        }
        const simp = new SimpleImage({ imageData });
        // this applies the k-means clustering centroid based downscaling algorithm to the image with 4 buckets and 10 iterations
        let { kCentroid } = DownScaler.kCenter(simp, w, h, 4, 10);

        const newCanvasData = {
          pixels: kCentroid.pixels.map(({ r, g, b, a }) => {
            // console.log(`${r} ${g} ${b} ${a}`);
            return RGBAToHex(r, g, b, a)
          }),
          width: w,
          height: h,
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

  const handleImageLoad = async (event) => {
    const target = event.target;
    const files = target.files;
    // get the first image selected by file-picker
    const base64 = await toBase64(files[0]);
    const type = files[0].type;
    const size = files[0].size;
    const name = files[0].name;
    console.log('loading file:', name, type, size);

    if (files[0].type.substring(0, 5) != "image") {
      alert("Invalid file type. Please select an image file.");
      return;
    }

    // now process it into the canvas if possible
    loadBase64Image(base64, canvasData.width, canvasData.height);
  };

  const handleProjectDocumentLoad = async (event) => {
    const target = event.target;
    const files = target.files;
    // get the first image selected by file-picker
    // console.log(files[0]);

    if (files[0].type !== "application/json") {
      alert("Invalid file type. Please select a JSON file.");
      return;
    }

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


  const toggleGrid = () => {

    setGridLinesVisible((prev) => !prev)
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

  const handleCreateNewImageConfirmed = async (newImage) => {
    console.log("New Canvas requested:", newImage);

    if (newImage.description.length > 64) {
      setConfirmationPopupData({
        title: "Image Generation Failed",
        message1: "Failed to generate image.",
        message2: "Description must be less than 64 characters.",
        onCancel: () => {
          setConfirmationPopupData(null);
        },
        onConfirm: () => {
          setConfirmationPopupData(null);
        },
      });
      return false;
    }

    // check if a job is already in progress
    // we only allow one at a time
    if (currentJobStatus !== 'idle' && currentJobStatus !== 'completed' && currentJobStatus !== 'failed') {
      setConfirmationPopupData({
        title: "Image Generation Failed",
        message1: "Failed to generate image.",
        message2: "A generation job is already in progress.",
        onCancel: () => {
          setConfirmationPopupData(null);
        },
        onConfirm: () => {
          setConfirmationPopupData(null);
        },
      });
      return false;
    }

    const response = await generateImage(newImage.description, newImage.canvasSize);
    console.log('generated image response:', JSON.stringify(response));

    if (response.success) {
      submitJob(response.jobId, newImage.canvasSize);
      return true;
    } else {
      setConfirmationPopupData({
        title: "Image Generation Failed",
        message1: "Failed to generate image.",
        message2: JSON.stringify(response.error),
        onCancel: () => {
          setConfirmationPopupData(null);
        },
        onConfirm: () => {
          setConfirmationPopupData(null);
        },
      });
      return false;
    }
  };

  const handleShareImageConfirmed = async (shareImg) => {

    canvasData.name = shareImg.name;
    canvasData.description = shareImg.description;
    canvasData.author = shareImg.author || "unknown";
    canvasData.tags = ['test', 'image']; // todo implement tags support on backend
    console.log('sharing canvas data:', canvasData);
    // send the canvas data to the server

    const displayFailedMessage = (msg1 = "Failed to share image.", msg2 = "Please try again later.") => {
      setConfirmationPopupData({
        title: "Share Image Failed",
        message1: msg1,
        message2: msg2,
        onCancel: () => {
          setConfirmationPopupData(null);
        },
        onConfirm: () => {
          setConfirmationPopupData(null);
        },
      });
    };

    const displaySuccessMessage = () => {
      setConfirmationPopupData({
        title: "Share Image Sucess",
        message1: "Image shared successfully.",
        message2: "You can view it in the gallery.",
        onCancel: () => {
          setConfirmationPopupData(null);
        },
        onConfirm: () => {
          setConfirmationPopupData(null);
        },
      });
    };

    // validate input before sending
    if (!canvasData.name || !canvasData.description) {
      displayFailedMessage("Failed to share image.", "Please provide a name and description.");
      return false;
    }

    if (canvasData.name.length > 32 || canvasData.description.length > 256) {
      displayFailedMessage("Failed to share image.", "Name must be less than 32 characters and description less than 256 characters.");
      return false;
    }

    try {
      let resp = await uploadToGallery(canvasData);
      console.log('upload to gallery response:', resp);
      if (resp.success) {
        displaySuccessMessage();
        return true;
      } else {
        displayFailedMessage();
        return false;
      }
    } catch (err) {
      console.error('failed to upload to gallery:', err);
      displayFailedMessage();
      return false;
    };
  };

  // load the image from the gallery page if it was passed
  useEffect(() => {
    // if this is not null, then we have an image to load.
    if (requestedImageLoad) {
      // Load the image data into the canvas
      console.log("Requesting to load image into editor:", requestedImageLoad);

      setConfirmationPopupData({
        title: "Load Image: " + requestedImageLoad.name,
        message1: "Would you like to load the image into the editor?",
        message2: "This will overwrite the current canvas data.",
        onCancel: () => {
          setConfirmationPopupData(null);
        },
        onConfirm: () => {
          if (pixelCanvasRef.current) {
            pixelCanvasRef.current.tryLoadCanvas(requestedImageLoad, true);
            nav(location.pathname, { replace: true, state: {} });
          }
          setConfirmationPopupData(null);
        },
      })
    }
  }, [requestedImageLoad]);

  // const [loadImageGenWithSize, setLoadImageGenWithSize] = useState(canvasSize || canvasData.width);

  // useEffect(() => {
  //   console.log('canvasSize changed:', canvasSize);
  //   setLoadImageGenWithSize(canvasSize || canvasData.width);
  // }, [canvasSize]);

  // load the new image from the generation job when it completes
  useEffect(() => {
    if (currentJobStatus === 'completed' && currentJobResult && currentJobResult.success) {
      console.log('job completed, loading new image:', currentJobResult);
      setConfirmationPopupData({
        title: "Generation " + currentJobStatus,
        message1: "Would you like to load the image into the editor?",
        message2: "This will overwrite the current canvas data.",
        imageSrc: currentJobResult.imageBlob,
        // imageSrc: currentJobResult.downloadUrl,
        // it would seem that extra content is not reactive :(
        // extraContent: (<SizeSelector label="Import with size:" currentSize={loadImageGenWithSize} updateSize={setLoadImageGenWithSize}/>),
        onCancel: () => {
          setConfirmationPopupData(null);
        },
        onConfirm: () => {
          loadBase64Image(currentJobResult.imageBlob, canvasSize || canvasData.width, canvasSize || canvasData.height);
          setConfirmationPopupData(null);
          clearJob();
        },
      })
    }
  }, [currentJobStatus, currentJobResult]);

  //
  // Editor Button Click Handlers
  //

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

  const onShareImageClicked = () => {
    setShowShareImagePrompt(true);
  };

  const onResizeImageClicked = () => {
    setShowResizePrompt(true);
  };
  const handleEyeDropperColor = (color) => {
    console.log("color from canvas:", color);
    // reset the tool choice to the previous tool in tool mode
    if (!("EyeDropper" in window)) {
      if (previousTool != undefined && previousTool !== 'eyedropper') {
        setTool(previousTool)
      } else {
        setTool("pencil");
      }
    }
    setBrushColor(color);
  };

  const contextMenuOptions = [
    { text: "Generate New", onClick: onCreateNewImageClicked },
    { text: "Save", onClick: onSaveClicked },
    { text: "Open", onClick: onImportProjectClicked },

    { text: "Import Image", onClick: onImportImageClicked },
    { text: "Export Image", onClick: onExportDownloadClicked },

    { text: "Resize Canvas", onClick: onResizeImageClicked },

    { text: "Share", onClick: onShareImageClicked },
    { text: "View Gallery", onClick: () => nav("/") },
  ];

  return (
    <div className="editor-container">
      <NewImagePopup
        isOpen={showNewImagePrompt}
        onClose={() => { setShowNewImagePrompt(false) }}
        onCreate={async (newImage) => {
          if (await handleCreateNewImageConfirmed(newImage)) {
            // close the prompt on success only
            setShowNewImagePrompt(false);
          }
        }}
      />
      <ShareImagePopUp
        isOpen={showShareImagePrompt}
        onClose={() => { setShowShareImagePrompt(false) }}
        onShare={async (newImage) => {
          if (await handleShareImageConfirmed(newImage)) {
            // close the share popup on success only
            setShowShareImagePrompt(false);
          }
        }} />

      <ScaleImagePopup isOpen={showResizePrompt} setIsOpen={setShowResizePrompt} onConfirm={handleResize} currentCanvasSize={canvasData.width} />

      {/* 
        confirmation popup is above all the rest
        in case we decide to pass down the ability
        to activate it from children.
        Seems the most recent component gets vertical priority
      */}
      <ConfirmationPopup popupData={confirmationPopupData} />

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
        onShareCurrentCanvasClicked={onShareImageClicked}
      />
      <EditorLeftToolBar
        selectedColor={brushColor}
        setSelectedColor={setBrushColor}
        secondaryColor={secondaryBrushColor}
        setSecondaryColor={setSecondaryBrushColor}
        onEyeDropperClicked={async () => {
          await handleEyeDropper(handleEyeDropperColor);
        }}
        toggleGridLines={toggleGrid}
        gridLinesVisible={gridLinesVisible}
        tool={tool}
        setTool={setTool}
        setPreviousTool={setPreviousTool}
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
