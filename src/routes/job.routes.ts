import { Router } from 'express';
import { Role } from '../config/prisma';
import { getJob, getAllJobs, createJob, updateJob, deleteJob, getAuthEmployerJobs } from '../controllers/job.controller';
import authorize from '../middlewares/authorize';
import authenticate from '../middlewares/authenticate';
const jobRoutes = Router();

jobRoutes.get('/', getAllJobs);
jobRoutes.get('/employer', authenticate, authorize(Role.EMPLOYER), getAuthEmployerJobs);
jobRoutes.get('/:id', getJob);
jobRoutes.post('/create', authenticate, authorize(Role.EMPLOYER), createJob);
jobRoutes.put('/update/:id', authenticate, authorize(Role.EMPLOYER), updateJob);
jobRoutes.delete('/delete/:id', authenticate, authorize(Role.EMPLOYER), deleteJob);

export default jobRoutes;
