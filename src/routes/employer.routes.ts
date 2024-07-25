import { Router } from 'express';
import { Role } from '../config/prisma';
import { getEmployerProfile, setEmployerProfile } from '../controllers/employer.controller';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const employerRoutes = Router();

employerRoutes.post('/profile/:empId', getEmployerProfile);
employerRoutes.post('/profile-setting', authenticate, authorize(Role.EMPLOYER), setEmployerProfile);

export default employerRoutes;
