import { getApiEndpoint } from '../utils';

// Fetches a single image from the gallery api
export default async function generateImage(prompt, size, seed) {
    let resp;
    try {
        const seedParam = seed ? `&seed=${encodeURIComponent(JSON.stringify(seed))}` : '';
        const sizeParam = size ? `&size=${encodeURIComponent(JSON.stringify(size))}` : '';
        resp = await fetch(getApiEndpoint() + `/image/generate?prompt=${encodeURIComponent(prompt)}${sizeParam}${seedParam}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        if (!resp.ok) {
            console.error('Error requesting image generation: ', resp);
            return {success:false, status: resp.status, ...await resp.json()};
        }
        const j = await resp.json();
        return j;
    }
    catch (e) {
        console.error('Fetch to api failed with exception ',e, ' got response ', resp);
        return {success:false, status: -1, error: e};
    }
}