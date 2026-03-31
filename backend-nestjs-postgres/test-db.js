const { Client } = require('pg');
const fs = require('fs');

const passwords = ['root', '123456', 'postgres', 'password', 'admin', ''];
let success = false;

async function testPasswords() {
  for (const pwd of passwords) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: pwd,
      database: 'postgres' // connect to default db first to avoid database not found error
    });
    try {
      await client.connect();
      console.log(`Success with password: "${pwd}"`);
      
      // Update .env
      const envContent = `DB_HOST=localhost\nDB_PORT=5432\nDB_USERNAME=postgres\nDB_PASSWORD=${pwd}\nDB_NAME=gia_pha\n`;
      fs.writeFileSync('.env', envContent);
      console.log('.env updated.');
      
      // Create gia_pha if not exists
      try {
        await client.query('CREATE DATABASE gia_pha');
        console.log('Database gia_pha created.');
      } catch(e) {
        if (e.code === '42P04') {
          console.log('Database gia_pha already exists.');
        } else {
          console.error('Error creating database:', e.message);
        }
      }
      
      await client.end();
      success = true;
      break;
    } catch (err) {
      console.log(`Failed with password: "${pwd}"`);
    }
  }
  if (!success) {
    console.error('Could not find the correct password.');
    process.exit(1);
  }
}
testPasswords();
