import { Router } from 'express';
import { Role } from '../config/prisma';
import {
    getApplication,
    getAllApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    getAuthWorkerApplications,
    getAuthEmployerJobApplications,
    changeApplicationStatus,
} from '../controllers/apply.controller';
import authorize from '../middlewares/authorize';
import authenticate from '../middlewares/authenticate';

const applicationRoutes = Router();

applicationRoutes.get('/', getAllApplications);
applicationRoutes.get('/worker', authenticate, authorize(Role.WORKER), getAuthWorkerApplications);
applicationRoutes.get('/:id', getApplication);
applicationRoutes.patch('/change/:id/status', authenticate, authorize(Role.EMPLOYER), changeApplicationStatus);
applicationRoutes.get('/employer/:jobId', authenticate, authorize(Role.EMPLOYER), getAuthEmployerJobApplications);
applicationRoutes.post('/create', authenticate, authorize(Role.WORKER), createApplication);
applicationRoutes.put('/update/:id', authenticate, authorize(Role.WORKER), updateApplication);
applicationRoutes.delete('/delete/:id', authenticate, authorize(Role.WORKER), deleteApplication);

export default applicationRoutes;
