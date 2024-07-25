import { Router } from 'express';
import { Role } from '../config/prisma';
import { getWorkerProfile, setWorkerProfile } from '../controllers/worker.controller';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const workerRoutes = Router();

workerRoutes.post('/profile/:workerId', getWorkerProfile);
workerRoutes.post('/profile-setting', authenticate, authorize(Role.WORKER), setWorkerProfile);

export default workerRoutes;
