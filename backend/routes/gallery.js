const { MongoClient } = require('mongodb');
require('dotenv').config();

// Database values
const connectionString = "mongodb+srv://sanjeev:sanjeev3090@comp229.ygv1o.mongodb.net/";
const client = new MongoClient(connectionString);
const dbName = "pixel_adventure";
let db, canvases;  // Database and the collection

// Database Connection Function
async function dbConnect() {
  try {
    await client.connect();  // Establish the connection
    console.log("Connected to MongoDB");
    db = client.db(dbName);  // Get the database
    canvases = db.collection("canvases");  // Get the collection
  } catch (e) {
    console.log("Database connection failed: " + e.message);
    throw e;
  }
}

dbConnect();


