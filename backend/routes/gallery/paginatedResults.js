const collectionName = process.env.COLLECTION_NAME; 

export const paginatedResults = (db) => {   
    return async (req, res, next) => {

        // Get the 'page' and 'limit' query parameters from the request
        const page = parseInt(req.query.page) || 1; // Default is: 1
        const limit = parseInt(req.query.limit) || 10; // Default  is: 10

        // Calculate the range of canvases for the current page.
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        const collection = db.collection(collectionName);  // Get the collection from db connection

        try {
            // Count the total number of canvases in the collection.
            const totalCanvases = await collection.countDocuments();

            // Add a 'next' property if there are more canvases after the current page.
            if (endIndex < totalCanvases) {
                results.next = {
                    page: page + 1,
                    limit: limit
                };
            }

            // Add a 'previous' property if the current page is not the first page.
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit: limit
                };
            }

            // Fetch the canvases for the current page from the collection.
            results.results = await collection.find().skip(startIndex).limit(limit).toArray();

            // Sending the paginated result in response
            res.paginatedResults = results;

            next();
        } catch (e) {
            console.error('Error in paginated API:', e.stack || e);
            res.status(500).json({ success: false, error: 'Error fetching paginated results' });
        }finally {
            if (db) db.client.close();  // Ensure that the connection is closed after pagination
        }
    };
};
