import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

//Test
app.get('/', (req: Request, res: Response) => {
    res.send('Hello This Is The Asher Backend App with endpoint');
});

export default app;
