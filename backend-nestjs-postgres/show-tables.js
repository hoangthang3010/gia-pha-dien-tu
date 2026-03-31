require('dotenv').config();
const { Client } = require('pg');

async function test() {
  const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'gia_pha', // The correct DB
  });
  
  await client.connect();
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  console.log("Tables in gia_pha:", res.rows.map(r => r.table_name));
  await client.end();
}
test();
