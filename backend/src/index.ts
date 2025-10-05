import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AUTH_URL } from './constants/apiEndPoints';

dotenv.config();
const app = express();

app.use(cors({ origin: "*", credentials: true }));


//middlewares
app.use(express.json());
app.use(cookieParser())

//Routes
app.use(AUTH_URL, authRoutes);

app.get("/", (req, res) => {
    res.send("Server running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});