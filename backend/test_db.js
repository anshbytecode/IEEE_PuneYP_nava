const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
console.log('Connecting to:', connectionString.replace(/:[^:@]+@/, ':****@'));

// Instantiate without custom SSL options in pg client to test connection string params directly
const client = new Client({
  connectionString: connectionString
});

client.connect()
  .then(() => {
    console.log('Successfully connected to the database!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Query result:', res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
