import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());

app.use(createProxyMiddleware({
    pathFilter: '/api/auth',
    target: process.env.AUTH_SERVICE,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: fixRequestBody,
    onError: (err, req, res) => {
        console.error("❌ [PROXY ERROR]:", err.message);
        res.status(500).json({ error: "Proxy to Auth Service failed" });
    }
}));

app.use(createProxyMiddleware({
    pathFilter: '/api/user',
    target: process.env.USER_SERVICE,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: fixRequestBody,
    onError: (err, req, res) => {
        console.error("❌ [PROXY ERROR]:", err.message);
        res.status(500).json({ error: "Proxy to Auth Service failed" });
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("CareerSync API Gateway is running...");
});

export default app;