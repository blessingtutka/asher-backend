import { Router } from 'express';
import { Role } from '../config/prisma';
import { getWorkerExperiences, createWorkerExperience, deleteWorkerExperience } from '../controllers/experience.controller';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const experienceRoutes = Router();

experienceRoutes.get('/list', getWorkerExperiences);
experienceRoutes.post('/create', authenticate, authorize(Role.WORKER), createWorkerExperience);
experienceRoutes.delete('/delete/:id', authenticate, authorize(Role.WORKER), deleteWorkerExperience);

export default experienceRoutes;
