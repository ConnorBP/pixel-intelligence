import { useState, useRef } from "react";
import "../css/NewImagePopup.css";
// import popUpTabHandler from "../hooks/popUpTabHandler";

const ScaleImagePopup = ({ isOpen, setIsOpen = (val)=>{}, onCancel = ()=>{}, onConfirm = ()=>{}, currentCanvasSize = 16 }) => {
    if (!isOpen) return (<></>);

    const [canvasSize, setCanvasSize] = useState(currentCanvasSize);
    const canvasRef = useRef(null);

    const updateSizePreview = (newSize) => {
        if (canvasSize != newSize) {
            // scale image to preview
        }
        setCanvasSize(newSize);
    };

    // popUpTabHandler({
    //     tabPopupRef: canvasRef,
    //     isOpen,
    //     onClose: () => {
    //       setIsOpen(false);
    //       onCancel();
    //     },
    //   });
    

    return (
        <div className="popup-overlay">
            <div className="popup-box" ref={canvasRef} tabIndex={-1}>
                <h3 className="popup-title">Resize Image Canvas</h3>
                <div className="popup-line"></div>
                <div className="popup-form">
                    <label className="popup-label">Scale the current image to</label>
                    <div className="popup-preview-wrapper flex-between" >
                        {/* todo add preview */}
                        {/* <div className="popup-preview"> 
                            <canvas
                                className="preview-canvas"
                                ref={canvasRef}
                                width={64}
                                height={64}
                            ></canvas>
                        </div> */}
                        <div className="popup-canvas-size">
                            <label className="popup-label">Canvas Size:</label>
                            <select
                                value={canvasSize}
                                onChange={(e) => updateSizePreview(e.target.value)}
                                className="select"
                            >
                                <option value={8}>08x08</option>
                                <option value={16}>16x16</option>
                                <option value={32}>32x32</option>
                                <option value={64}>64x64</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-end">
                        <button onClick={() => { setIsOpen(false); onCancel(); }} className="button popup-button cancel-button">
                            Cancel
                        </button>
                        <button onClick={() => { setIsOpen(false); onConfirm(canvasSize); }} className="button popup-button create-button">
                            Resize
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScaleImagePopup;