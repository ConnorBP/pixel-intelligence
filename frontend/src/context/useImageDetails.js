import { createContext, useContext } from 'react';

export const ImageDetailsContext = createContext(null);

export const useImageDetails = () => {
    const {
        images,
        addImage,
        getImage
    } = useContext(ImageDetailsContext);

    return {
        images,
        addImage,
        getImage
    };
};

export default useImageDetails;