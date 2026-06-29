require('dotenv').config();
const { Client } = require('pg');

async function test() {
  const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres', // check master DB
  });
  
  await client.connect();
  const res = await client.query(`SELECT datname FROM pg_database WHERE datistemplate = false;`);
  console.log("Databases on Server:", res.rows.map(r => r.datname));
  await client.end();
}
test();
