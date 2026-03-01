import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import UserRoutes from "./routes/User.js";

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://fitracker-6.onrender.com',
    'https://fitracker-4.onrender.com',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
});


app.get("/",async(req, res) => {
    res.status(200).json({
        message: "FitTracker API is running",
        status: "healthy"
    });
});

app.use("/api/user", UserRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Centralized error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    
    // Log errors in production (but not sensitive data)
    console.error(`Error ${status}: ${message}`);
    
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try{
        await connectDB();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();