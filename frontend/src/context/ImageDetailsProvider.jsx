import { createContext, useReducer } from 'react';
import { ImageDetailsContext } from './useImageDetails';

export const ImageDetailsProvider = ({ children }) => {
    const [images, dispatchImages] = useReducer((state, action) => {
        const currentMap = new Map(state.map);

        switch (action.type) {
            case 'update':
            case 'add':
                if (!action.id) {
                    console.error('Image id is undefined:', action.image);
                    return state;
                }
                // console.log('adding image ', action.id, ' ', action.image, ' to map ', state.map);
                return { ...state, map: currentMap.set(action.id, action.image), lastUpdate: Date.now() };
            case 'remove':
                currentMap.delete(action.id);
                return { ...state, map: currentMap, lastUpdate: Date.now() };
            case 'clear':
                return { map: new Map(), lastUpdate: Date.now() };
            default:
                return state;
        }
    }, {
        map: new Map(),
    });

    function addImage(image) {
        if (!image._id) {
            console.error('Image id is undefined:', image);
            return;
        }
        dispatchImages({ type: 'add', id: image._id, image });
    }

    async function getImage(id) {
        if (images.map.has(id)) {
            return {
                status: 'cached',
                image: images.map.get(id)
            };
        } else {

        }
        return 
    }

    return (
        <ImageDetailsContext.Provider value={{
            images: images.map,
            addImage,
            getImage
        }}>
            {children}
        </ImageDetailsContext.Provider>
    );
};

export default ImageDetailsProvider;