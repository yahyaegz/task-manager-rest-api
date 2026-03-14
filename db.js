require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test connection and initialize table
const initDb = async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL successfully');
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                completed BOOLEAN DEFAULT false
            );
        `);
        console.log('Tasks table ensured');
        client.release();
    } catch (err) {
        console.error('Database initialization error:', err.message);
        console.log('NOTE: Please ensure PostgreSQL is running and credentials in .env are correct.');
    }
};

initDb();

module.exports = pool;
