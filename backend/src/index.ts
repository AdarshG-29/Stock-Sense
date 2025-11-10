import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import candleDataRoutes from './routes/candles.route';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AUTH_ROUTE, CANDLES_ROUTE } from './config/apiPaths';

dotenv.config();
const app = express();

app.use(cors({ origin: "*", credentials: true }));


//middlewares
app.use(express.json());
app.use(cookieParser())

//Routes
const routes = [
    { path: AUTH_ROUTE, handler: authRoutes },
    { path: CANDLES_ROUTE, handler: candleDataRoutes },
];

// Dynamically load routes for better scalability
routes.forEach(({ path, handler }) => {
    app.use(path, handler);
});

// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

app.get("/", (req, res) => {
    res.send("Server running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});