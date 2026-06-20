require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'gia_pha',
      },
);

async function runSeed() {
  try {
    await client.connect();
    console.log('Connected to DB');
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql')).toString();
    await client.query(sql);
    console.log('Seed executed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await client.end();
  }
}
runSeed();
