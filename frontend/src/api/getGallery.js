import { getApiEndpoint } from '../utils';

// Fetches the gallery from the server
// includes pagination support
export default async function getGallery(page = 1, limit = 10) {
    let resp;
    try {
        resp = await fetch(getApiEndpoint() + `/gallery/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!resp.ok) {
            console.error('Error fetching gallery: ', resp);
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