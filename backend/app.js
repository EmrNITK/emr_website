import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/Auth.router.js";
import teamRouter from "./routes/Team.router.js";
import inviteRouter from "./routes/Invite.router.js";
import userRouter from "./routes/User.router.js";
import joinRouter from "./routes/Join.router.js";

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
app.use('/api/teams',teamRouter);
app.use('/api/invite',inviteRouter);

app.use('/api/users',userRouter);
app.use('/api/teams',teamRouter);
app.use('/api/teams',joinRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ success: false, statusCode, message });
});

export default app;
