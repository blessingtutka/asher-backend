import { Router } from 'express';
import { Role } from '../config/prisma';
import { getEmployerProfile, setEmployerProfile, getYourEmployerProfile } from '../controllers/employer.controller';
import { uploadFile } from '../middlewares/upload';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const employerRoutes = Router();

employerRoutes.get('/profile', authenticate, authorize(Role.EMPLOYER), getYourEmployerProfile);
employerRoutes.get('/profile/:empId', getEmployerProfile);
employerRoutes.put('/profile-setting', authenticate, authorize(Role.EMPLOYER), uploadFile('profile'), setEmployerProfile);

export default employerRoutes;
