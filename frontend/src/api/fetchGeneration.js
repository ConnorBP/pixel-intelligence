import { getApiEndpoint } from '../utils';

// gets the status of a job from the API AND the image to download from if its ready.
// warning: very rate limited, only use when checkImage has returned 'completed' already.

export default async function fetchGeneration(jobId) {
    let resp;
    try {
        resp = await fetch(getApiEndpoint() + `/image/download/${jobId}`, {
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
        if (j.success && j.downloadUrl) {
            // now try to download the image result itself
            const imageResp = await fetch(j.downloadUrl, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                mode: 'cors'
            });
            if (!imageResp.ok) {
                console.error('Error downloading image: ', imageResp);
                return { success: false, status: imageResp.status, error: imageResp.statusText };
            }
            const imageBlob = await imageResp.blob();
            j.imageBlob = imageBlob;
        } else {
            console.error('Invalid response from generation status: ', j);
            return { success: false, status: 500, error: 'invalid response' };
        }
        return j;
    }
    catch (e) {
        console.error('Fetch to api failed with exception ', e, ' got response ', resp);
        return { success: false, status: -1, error: e.message };
    }
}