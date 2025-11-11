import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'link_platform',
  waitForConnections: true,
  connectionLimit: 10,
});

export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MariaDB connected successfully');
    connection.release();
  } catch (err) {
    console.error('MariaDB connection error:', err);
    throw err;
  }
};
