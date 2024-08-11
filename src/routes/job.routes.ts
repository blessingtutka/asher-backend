import { Router } from 'express';
import { Role } from '../config/prisma';
import { getJob, getAllJobs, createJob, updateJob, deleteJob, getAuthEmployerJobs, searchJobs } from '../controllers/job.controller';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import { uploadFile } from '../middlewares/upload';

const jobRoutes = Router();

// Public Routes
jobRoutes.get('/', getAllJobs);
jobRoutes.get('/search', searchJobs);

// Employer Jobs Routes
jobRoutes.get('/employer', authenticate, authorize(Role.EMPLOYER), getAuthEmployerJobs);

jobRoutes.get('/:id', getJob);
jobRoutes.post('/create', authenticate, authorize(Role.EMPLOYER), uploadFile('image'), createJob);
jobRoutes.put('/update/:id', authenticate, authorize(Role.EMPLOYER), uploadFile('image'), updateJob);
jobRoutes.delete('/delete/:id', authenticate, authorize(Role.EMPLOYER), deleteJob);

export default jobRoutes;
