import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/Auth.router.js";
import teamRouter from "./routes/Team.router.js";
import inviteRouter from "./routes/Invite.router.js";
import userRouter from "./routes/User.router.js";
import memberRouter from "./routes/Member.router.js";
import joinRouter from "./routes/Join.router.js";
import cors from "cors"
import methodOverride from "method-override";
dotenv.config();

const app = express();

// Cookie parser middleware
app.use(cookieParser());

// Use method-override middleware
app.use(methodOverride("_method"));

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:5173'],  // Add your allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    credentials: true,  // Enable credentials (cookies, etc)
    optionsSuccessStatus: 200,  // Some legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));
// Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Root route
app.get('/', (req, res) => {
    res.send("Server is ready to use!!!");
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/teams', teamRouter);
app.use('/api/teams', inviteRouter);
app.use('/api/teams', joinRouter);
app.use('/api/teams', memberRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ success: false, statusCode, message });
});

export default app;
