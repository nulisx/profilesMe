import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import userRoutes from './routes/userRoutes';
import linkRoutes from "./routes/linkRoutes"
import authRoutes from './routes/authRoutes';
import './config/passport';
import { mongoDB } from './config/database';

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 
  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000');

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-session-secret-please-change';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-please-change';

if (!process.env.SESSION_SECRET || !process.env.JWT_SECRET) {
  console.warn('Warning: Using default secrets. Set SESSION_SECRET and JWT_SECRET in Replit Secrets for production.');
}

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/links', linkRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});
app.get('/' , (req,res)=> {
  res.json({status: 'ok'})
})
app.listen(3000, () => {
  mongoDB()
  console.log(`Server is running `);
});