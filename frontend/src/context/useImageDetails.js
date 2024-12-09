import { createContext, useContext } from 'react';

export const ImageDetailsContext = createContext(null);

export const useImageDetails = () => {
    const {
        images,
        addImage,
        getImage,
        fetchImage
    } = useContext(ImageDetailsContext);

    return {
        images,
        addImage,
        getImage,
        fetchImage
    };
};

export default useImageDetails;