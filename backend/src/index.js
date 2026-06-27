import './config/env.js';
import app from './app.js';
import { connectDB } from './db/connect.js';

connectDB()
    .then(() => {
        console.log('Connected to the database');
        const PORT = 3000;
        const HOST = '127.0.0.1'; // Restricts access strictly to your local machine

        app.listen(PORT, HOST, () => {
         console.log(`Server is running locally on http://${HOST}:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    });