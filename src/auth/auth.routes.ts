import { Router } from 'express';
import { register, login, userProfile } from './auth.controller';
import authenticate from '../middlewares/authenticate';
const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/profile', authenticate, userProfile);

export default authRoutes;
