const validateCanvasData = (canvasData) => {

    const errors = [];
  
    // Check if name is present and must be less than 32 
    if(!canvasData.name || canvasData.name.length > 32) {
        errors.push('Name is required and must be less than 32 characters.');
    }
  
    // Check if description is present and must be less than 255
    if(!canvasData.description || canvasData.description > 255) {
        errors.push('Description is required and must be less than 255 characters.');
    }

    // Check if pixels is an array and not empty
    if(!Array.isArray*(canvasData.pixels) || canvasData.pixels.length === 0) {
        errors.push('Pixels array is required and cannot be empty.');
    }

    // Check if width and height are set and are equal
    if(!canvasData.width || !canvasData.height || canvasData.width !== canvasData.height) {
        errors.push('Canvas width and height must match.');
    }

    // Check if width and height are one of the allowed values
    if (!(canvasData.width === 16 || canvasData.width === 32 || canvasData.width === 64) ||
    !(canvasData.height === 16 || canvasData.height === 32 || canvasData.height === 64)) {
        errors.push('Canvas width and height must be 16, 32, or 64.');
    }

    // Check if the number of pixels does not exceed the total number of pixels allowed on the canvas
    if (canvasData.pixels.length > canvasData.width * canvasData.height) {
        errors.push('Pixels array exceeds canvas dimensions.');
    }

    // If any errors are there then return them else return null
    return errors.length > 0 ? errors : null;
  
  }