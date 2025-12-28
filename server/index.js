import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import UserRoutes from "./routes/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true }));


app.get("/",async(req, res) => {
    res.status(200).json({
        message: "hi developers",
    });
});

app.use("/api/user", UserRoutes);

// error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
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
const startServer = async () => {
    try{
        await connectDB();
        app.listen(8080, () => console.log("server running at port 8080"))
    } catch (err) {
        console.log(err);
    }
};

startServer();