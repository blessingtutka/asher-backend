import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes';
import employerRoutes from './routes/employer.routes';
import workerRoutes from './routes/worker.routes';
import jobRoutes from './routes/job.routes';
import applicationRoutes from './routes/apply.routes';
import path from 'path';
import bodyParser from 'body-parser';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/apply', applicationRoutes);

//Not Found Routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
export default app;
