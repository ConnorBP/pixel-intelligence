import { MongoClient } from "mongodb";

export const dbStringURL = process.env.MONGO_DB_STRING; // Database connection string
export const dbName = process.env.DATABASE_NAME; // Database Name
export const canvasCollection = process.env.CANVAS_COLLECTION; // Canvas Collection Name
export const imageJobsCollection = process.env.IMAGE_JOBS_COLLECTION; // Image Jobs Collection
export const maxErrorRetries = process.env.Max_ERROR_RETRIES; // Max Error Retries user have 


//********** DATABASE CONNECTION **********//
export const connectToDB = async () => {
    const client = new MongoClient(dbStringURL);
    try {
        await client.connect();
        console.log("Connected to database");
        return client.db(dbName); // Return the connected database instance
    } catch (e) {
        console.error("Failed to connect to the database: ", e.stack || e);
        throw new Error("Database connection failed.");
    }
};

//********** CANVAS FUNCTIONS **********//

// Saving the canvas into the database
export const saveCanvasData = async (canvasData) => {
    let db;
    try {
        db = await connectToDB();
        const collection = db.collection(canvasCollection);

        // Insert canvas data into the collection
        const result = await collection.insertOne(canvasData);
        console.log("Canvas data inserted.", result.insertedId);
        return result; 
    } catch (e) {
        console.error("Error inserting canvas data: ", e.stack || e);
        throw new Error("Failed to insert canvas data.");
    } finally {
        if (db) db.client.close(); // Close the database connection
    }
};

//********** IMAGE JOB FUNCTIONS **********//

// Saving image job data to the "image_jobs" collection
export const saveImageJobData = async(jobData) => {
    let db;
    try{
        db = await connectToDB();
        const collection = db.collection(imageJobsCollection);

        // Insert image job data to the collection
        const result = await collection.insertOne(jobData);
        console.log("Image job data inserted successfully.");
        return result;
    } catch (e) {
        console.error("Error inserting image job data: " + e.stack || e);
        throw new Error("Failed to insert image job data.");
    } finally {
        if (db) db.client.close(); // close the database connection
    }
}

// Retrieving job data by job ID
export const getImageJobData = async(jobId, dbConnection) => {
    let db;
    try {
        if(!dbConnection){
            db = await connectToDB();
        } else {
            db = dbConnection;
        }
        const collection =  db.collection(imageJobsCollection);

        // Retrieving the image job data
        const result = await collection.findOne({jobId});
        return result;
    } catch (e) {
        console.error("Error retrieving image job data: ", e.stack || e);
        throw new Error("Failed to retrieve job data.");
    } finally {
        if (db && !dbConnection) db.client.close();
    }
}

// Function to check if a job ID exists in the database
// optionally takes in an existing db connection to avoid
// creating a new one if not needed
export const doesJobIdExist = async (jobId, dbConnection) => {
    let db;
    try {
        if(!dbConnection){
            db = await connectToDB();
        } else {
            db = dbConnection;
        }
        const collection = db.collection(imageJobsCollection);

        // Check if the job ID exists
        const result = await collection.findOne({ jobId });
        // double negation to convert to boolean because js is stupid
        return !!result;
    } catch (e) {
        console.error("Error checking job ID existence: ", e.stack || e);
        throw new Error("Failed to check job ID existence.");
    } finally {
        if (db && !dbConnection) db.client.close();
    }
};

// Updating the image jon status in database
export const updateImageJobStatus = async (jobId, status, downloadUrl) => {
    const db = await connectToDB();
    try {
        const collection = db.collection(imageJobsCollection);
        await collection.updateOne(
            { jobId },
            { $set: { status, downloadUrl } }
        );
        console.log(`Job ${jobId} updated to ${status}`);
    } catch (e) {
        console.error("Error updating image job data: ", e.stack || e);
        throw new Error("Failed to retrieve job data.");
    } finally {
        db.client.close();
    }
};


// Cancel Image Job:  Not using this at this moment 
export const cancelImageJob = async (jobId) => {
    const db = await connectToDB();
    try{
        const collection = db.collection(imageJobsCollection);
        const result = await collection.updateOne(
            {jobId},
            { $set: { status: "canceled"} }
        );
        console.log(`Job ${jobId} cancelled.`);
        return result;
    } catch (e) {
        console.error("Error cancelling image job: ", e.stack || e);
        throw new Error("Failed to cancel job..");
    } finally {
        db.client.close();
    }
};

//**********RETURN DB CONNECTION**********//

// Function to return database connection
export const getDBConnection = async () => {
    let db;
    try {
        db = await connectToDB();
        return db;
    } catch (e) {
        console.error("Error retrieving canvases: ", e.stack || e);
        throw new Error("Failed to retrieve canvases.");
    }
};
