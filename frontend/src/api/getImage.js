import { getApiEndpoint } from '../utils';

// Fetches a single image from the gallery api
export default async function getImage(imageId) {
    let resp;
    try {
        resp = await fetch(getApiEndpoint() + `/gallery/image/${imageId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!resp.ok) {
            console.error('Error fetching gallery image: ', resp);
            return [];
        }
        const j = await resp.json();
        return j;
    }
    catch (e) {
        console.error('err ',e, ' got response ', resp);
        return [];
    }
}