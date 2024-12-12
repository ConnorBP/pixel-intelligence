import { createContext, useCallback, useReducer } from 'react';
import { ImageDetailsContext } from './useImageDetails';
import { getImage as getImageFromApi } from '../api';
import { GeneratePng } from '../utils';

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
                return { ...state, map: currentMap.set(action.id, action.image), lastUpdate: new Date().getTime() };
            case 'remove':
                currentMap.delete(action.id);
                return { ...state, map: currentMap, lastUpdate: new Date().getTime() };
            case 'clear':
                return { map: new Map(), lastUpdate: new Date().getTime() };
            default:
                return state;
        }
    }, {
        map: new Map(),
    });

    const addImage = useCallback((image) => {
        if (!image._id) {
            console.error('Image id is undefined:', image);
            return;
        }
        dispatchImages({ type: 'add', id: image._id, image: { status: 'success', data: image } });
    }, []);

    const getImage = useCallback((id) => {
        if (id.length !== 24) {
            return {
                status: 'error',
                message: `Invalid image id ${id}`,
                image: null
            };
        }

        const cachedImage = images.map.get(id);

        if (cachedImage) {
            return cachedImage;
        }

        // Return loading state, let component handle fetch
        return {
            status: 'loading',
            image: null,
        };
    }, [images.map]);

    const fetchImage = useCallback(async (id) => {
        try {
            // dispatching like this before awaiting causes a state update during initial render
            // dispatchImages({ type: 'add', id, image: { status: 'loading' } });
            const imageResp = await getImageFromApi(id);
            // console.log('fetchImage response:', JSON.stringify(imageResp));

            if (imageResp.success) {
                const image = {
                    ...imageResp.image,
                    imgDataUrl: GeneratePng(imageResp.image)
                };
                dispatchImages({
                    type: 'add',
                    id,
                    image: { status: 'success', data: image }
                });
            } else {
                dispatchImages({
                    type: 'add',
                    id,
                    image: { status: 'error', message: imageResp.error }
                });
            }
        } catch (error) {
            dispatchImages({
                type: 'add',
                id,
                image: { status: 'error', message: error.message }
            });
        }
    }, []);

    return (
        <ImageDetailsContext.Provider value={{
            images: images.map,
            addImage,
            getImage,
            fetchImage
        }}>
            {children}
        </ImageDetailsContext.Provider>
    );
};

export default ImageDetailsProvider;