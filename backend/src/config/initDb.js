const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./db');
require('dotenv').config();

const initDb = async () => {
  try {
    console.log('Verifying and initializing database schema...');
    
    // Read and execute database.sql DDL statements
    const sqlPath = path.join(__dirname, '../../database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Run the SQL script
    await db.query(sql);
    console.log('Database tables successfully verified or created.');

    // Seed default admin account if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'yppune@ieee.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123';
    
    const adminCheck = await db.query('SELECT * FROM admins WHERE email = $1', [adminEmail]);
    if (adminCheck.rows.length === 0) {
      console.log('Creating default administrator account...');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
      
      await db.query(
        'INSERT INTO admins (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['IEEE Pune Admin', adminEmail, hashedPassword, 'superadmin']
      );
      console.log(`Seeding complete: Created admin account under "${adminEmail}"`);
    } else {
      console.log('Administrator account already exists in database.');
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

module.exports = initDb;
