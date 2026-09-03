const normalizeOrigin = (origin) => origin?.replace(/\/$/, '');

export const allowedOrigins = [
    normalizeOrigin(process.env.FRONTEND_URL),
    'https://codesync-frontendfrontend.onrender.com',
    'http://localhost:5173',
    'http://localhost:4000'
].filter(Boolean);

export const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
            return callback(null, true);
        }

        console.warn('CORS blocked origin:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 204
};
