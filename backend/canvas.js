const {MongoClient}  = require("mongodb");
require("dotenv").config();

const dbStringURL = process.env.MONGO_DB_STRING; // Database connection string
const dbName = process.env.DATABASE_NAME; // Database Name
const collectionName = process.env.COLLECTION_NAME; // Collection Name

// Database connection
const connectToDB = async () => {
    const client = new MongoClient(dbStringURL);
    try {
        await client.connect();
        console.log("Connected to database");
        return client.db(dbName); // Return the connected database instance
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw new Error("Database connection failed");
    }
};

// Saving the canvas into the database
const saveCanvasData = async (canvasData) => {
    let db;
    try {
        db = await connectToDB();
        const collection = db.collection(collectionName);

        // Insert canvas data into the collection
        const result = await collection.insertOne(canvasData);
        console.log("Canvas data inserted.", result.insertedId);
        return result; 
    } catch (error) {
        console.error("Error inserting canvas data:", error);
        throw new Error("Failed to insert canvas data");
    } finally {
        if (db) db.client.close(); // Close the database connection
    }
};

const getAllCanvases = async () => {
    let db;
    try {
        db = await connectToDB();
        const collection = db.collection(collectionName);

        // Retrieve all canvases from the collection
        const canvases = await collection.find().toArray();
        return canvases; // Return the array of canvases
    } catch (error) {
        console.error("Error retrieving canvases:", error);
        throw new Error("Failed to retrieve canvases");
    } finally {
        if (db) db.client.close();
    }
};

module.exports = { saveCanvasData, getAllCanvases};