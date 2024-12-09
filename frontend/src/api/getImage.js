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
            },
            mode: 'cors'
        });
        if (!resp.ok) {
            console.error('Error fetching gallery image: ', resp);
            return {success:false, status: resp.status, error: resp.statusText};
        }
        const j = await resp.json();
        return j;
    }
    catch (e) {
        console.error('Fetch to api failed with exception ',e, ' got response ', resp);
        return {success:false, status: -1, error: e};
    }
}