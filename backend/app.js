// dev mode only entry point for api testing

// import dotenv only once and very first
// imports for all files. NOTE: .js extension is important
// also on the production server dotenv will not be run.
// Only normal environment variables will be used
import 'dotenv/config';

// test that it worked by leaking secrets lol
// console.log(process.env.SECRET_KEY);
import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import cors from "cors";


const app = express();

// Middleware to parse JSON
app.use(express.json());

// Cookie Parser for all routes
app.use(cookieParser());

// allow any origin in dev mode
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};

// Enable CORS options for all routes
app.use(cors(corsOptions));

// Your routes here
app.use('/api', routes);

export default app;
