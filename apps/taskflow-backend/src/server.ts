import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth-routers';

dotenv.config();
connectDB();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 

app.get('/', (req: Request, res: Response) => {
  res.send('API TaskFlow is running...');
});

const PORT = process.env.PORT || 8000; 

app.listen(PORT, () => {
  console.log(`📡 Server running on port ${PORT}`);
});