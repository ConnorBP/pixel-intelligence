import { getApiEndpoint } from '../utils';

// Fetches the current generation status from the API
// the horde api version of this is rate limited to 10 requests per ip, and we should not hit that limit
export default async function checkGenerationStatus(jobId) {
    let resp;
    try {
        resp = await fetch(getApiEndpoint() + `/image/poll/${jobId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        if (!resp.ok) {
            console.error('Error fetching generation status: ', resp);
            return { success: false, status: resp.status, error: resp.statusText };
        }
        const j = await resp.json();
        return j;
    }
    catch (e) {
        console.error('Fetch to api failed with exception ', e, ' got response ', resp);
        return { success: false, status: -1, error: e.message };
    }
}