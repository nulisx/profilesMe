import mysql from 'mysql2/promise';
import mongoose from 'mongoose';

export const pool = mysql.createPool({
  socketPath: process.env.DB_SOCKET || '/tmp/mariadb.sock',
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

export const mongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO || 'mongodb://127.0.0.1:27017/link_platform';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};
