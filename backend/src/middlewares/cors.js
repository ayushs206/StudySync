import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
    'http://localhost:5173', 'http://localhost:8000'
]

export default cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(origin, allowedOrigins)
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
});