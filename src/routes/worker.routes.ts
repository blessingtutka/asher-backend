import { Router } from 'express';
import { Role } from '../config/prisma';
import { getWorkerProfile, setWorkerProfile, getYourWorkerProfile, getAllWorkers } from '../controllers/worker.controller';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const workerRoutes = Router();

workerRoutes.get('/list', getAllWorkers);
workerRoutes.get('/profile', authenticate, authorize(Role.WORKER), getYourWorkerProfile);
workerRoutes.get('/profile/:workerId', getWorkerProfile);
workerRoutes.put('/profile-setting', authenticate, authorize(Role.WORKER), setWorkerProfile);

export default workerRoutes;
