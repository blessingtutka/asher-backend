import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
// import userRoutes from './routes/userRoutes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/users', userRoutes)

//Test
app.get('/', (req: Request, res: Response) => {
    res.send('Hello This Is The Asher Backend App with endpoint');
});

export default app;
