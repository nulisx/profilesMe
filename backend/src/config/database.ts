import mongoose from 'mongoose';
import mysql from 'mysql2/promise';


export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'link_platform',
  waitForConnections: true,
  connectionLimit: 10,
});


export const mongoDB = () => {
  const MONGO_URI = process.env.MONGO || 'mongodb://127.0.0.1:27017';
  mongoose.connect(MONGO_URI, {dbName: 'link_platform'}).then(() => {
    console.log('MongoDB connected to', MONGO_URI);
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });
}