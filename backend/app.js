import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';

import connect from './db/db.js';

import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import authRoutes from './routes/auth.routes.js';

import configurePassport from './config/passport.js';

connect();

const app = express();

const passport = configurePassport();

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
);

app.use(cookieParser());

app.use(morgan('dev'));

app.use(express.json({
    limit: '10mb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'CodeSync Backend API is running 🚀'
    });
});

app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy'
    });
});

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/ai', aiRoutes);
app.use('/newsletter', newsletterRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

export default app;