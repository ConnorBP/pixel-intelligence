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
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable pre-flight requests
app.options('*', cors(corsOptions));



// Enable CORS options for all routes
app.use(cors(corsOptions));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Your routes here
app.use('/api', routes);

// Catch 404s
app.use((req, res, next) => {
    if (!res.headersSent) {
        console.log('APP 404 Not Found:', req.originalUrl);
        res.status(404).json({
            success: false,
            status: 404,
            message: 'Not Found'
        });
    }
});

// Error handler
app.use((err, req, res, next) => {
    if (!res.headersSent) {
        console.error('APP Error:', err.message);
        const status = err.status || 500;
        res.status(status).json({
            success: false,
            status,
            message: err.message
        });
    }
});

export default app;
