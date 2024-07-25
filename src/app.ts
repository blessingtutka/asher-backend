import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes';
import employerRoutes from './routes/employer.routes';
import workerRoutes from './routes/worker.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/worker', workerRoutes);

//Not Found Routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
export default app;
