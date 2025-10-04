import {pool} from '../db';

async function initDb() {
    try {
        await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
        console.log("pgcrypto extension ready.");

        //create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users 
            (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
        `);
        console.log("Users table created successfully.");
    } catch(err){
        console.error("Error initializing database:", err);
    } finally{
        console.log("Database connection closed.");
        await pool.end();
    }
}

initDb();