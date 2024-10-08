import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/Auth.routes.js";
import teamsRouter from "./routes/Teams.routes.js";

dotenv.config();

const app = express();


// Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


// Cookie parser middleware
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
    res.send("Server is ready to use!!!");
});

// API routes
app.use('/api/auth',authRouter);
app.use('/api/teams',teamsRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ success: false, statusCode, message });
});


export default app;
