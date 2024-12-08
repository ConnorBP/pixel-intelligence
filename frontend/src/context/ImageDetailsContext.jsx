// caches details of images by id that we have seen before in the gallery
// and provides them to components that need them

import { createContext, useContext, useEffect, useReducer } from 'react';
const ImageDetailsContext = createContext(null);

export const ImageDetailsProvider = ({ children }) => {
    // const [currentSession, setCurrentSession] = useLocalStorage("userSession",null);
    const [images, dispatchImages] = useReducer((state, action) => {
        switch (action.type) {
            case 'update':
            case 'add':
                return { ...state, map: state.map.set(action.id, action.image) };
            case 'remove':
                return { ...state, map: state.map.delete(action.id) };
            case 'clear':
                return { map: new Map() };
            default:
                return state;
        }
    },
    {
        map: new Map(),
    });

    
    function addImage(image) {
        dispatchImages({ type: 'add', image });
    }

    return (
        <ImageDetailsContext.Provider value={{
            images: images.map,
            addImage
        }}>
            {children}
        </ImageDetailsContext.Provider>
    );
};

export function useImageDetails() {
    const {
        images,
        addImage
    } = useContext(ImageDetailsContext);

    return {
        images,
        addImage
    };
};

