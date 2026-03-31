require('dotenv').config();
const { Client } = require('pg');
const { exec } = require('child_process');

async function init() {
  // 1. Connect to default 'postgres' db to create 'gia_pha' if needed
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await adminClient.connect();
    console.log('Connected to admin database.');
    
    // Create DB
    try {
      await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME || 'gia_pha'}`);
      console.log(`Database ${process.env.DB_NAME || 'gia_pha'} created.`);
    } catch(err) {
      if(err.code === '42P04') {
        console.log(`Database ${process.env.DB_NAME || 'gia_pha'} already exists.`);
      } else {
        throw err;
      }
    }
  } catch(e) {
    console.error('Failed to create database:', e);
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  // 2. Start server to sync tables
  console.log('Starting NestJS server to sync schema...');
  const server = exec('node dist/main.js');
  server.stdout.on('data', data => console.log('Server:', data));

  // 3. Wait 8s, run seed.js, kill server
  setTimeout(() => {
    console.log('Running seed.js...');
    exec('node seed.js', (err, stdout, stderr) => {
      if (err) console.error(err);
      if (stderr) console.error(stderr);
      console.log(stdout);
      
      console.log('Killing server...');
      server.kill();
      process.exit(0);
    });
  }, 8000);
}

init();
