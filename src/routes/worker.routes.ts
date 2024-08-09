import { Router } from 'express';
import { Role } from '../config/prisma';
import { getWorkerProfile, setWorkerProfile, getYourWorkerProfile, getAllWorkers } from '../controllers/worker.controller';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import { uploadFile, uploadFields } from '../middlewares/upload';

const workerRoutes = Router();

workerRoutes.get('/list', getAllWorkers);
workerRoutes.get('/profile', authenticate, authorize(Role.WORKER), getYourWorkerProfile);
workerRoutes.get('/profile/:workerId', getWorkerProfile);
workerRoutes.put('/profile-setting', authenticate, authorize(Role.WORKER), uploadFields([{ name: 'profile' }, { name: 'cvFile' }]), setWorkerProfile);

export default workerRoutes;
