import { getApiEndpoint } from '../utils';

export default async function getGallery() {
    let resp;
    try {
        resp = await fetch(getApiEndpoint() + '/gallery/all', {
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
        return j.results;
    }
    catch (e) {
        console.error('err ',e, ' got response ', resp);
        return [];
    }
}