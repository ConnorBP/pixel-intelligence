import { getApiEndpoint } from '../utils';

// Uploads canvas data to the gallery
export default async function uploadToGallery(canvasData) {
    let resp;
    try {
        resp = await fetch(getApiEndpoint() + '/gallery/upload', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(canvasData)
        });
        if (!resp.ok) {
            console.error('Error uploading to gallery: ', resp);
            return { success: false, error: 'Failed to upload canvas data' };
        }
        const j = await resp.json();
        return j;
    } catch (e) {
        console.error('Error uploading to gallery: ', e);
        return { success: false, error: 'Internal server error' };
    }
}