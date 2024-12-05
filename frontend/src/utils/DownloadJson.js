// download a js object as a json file
export default function (obj, name = 'pixel-ai-project') {

    try {
        // convert the data to json blob
        const blob = new Blob([JSON.stringify(obj, null, 2)], {
            type: 'application/json',
        });
        // make a url for the object
        const url = URL.createObjectURL(blob);

        // generate a temporary link element outside the dom to cause a download event
        var link = document.createElement('a');
        link.download = `${name}.json`;
        link.href = url;
        link.click();
        // finally, revoke the url
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('file export failed: ', err);
        return false;
    }
    return true;
}