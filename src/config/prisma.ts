import { PrismaClient, Role, EmpType } from '@prisma/client';
import type { User, Employer, Worker, WorkerExperience, Job, JobType, Application } from '@prisma/client';

const prisma = new PrismaClient();

export { User, Role, EmpType, Employer, Worker, WorkerExperience, Job, JobType, Application };

export default prisma;
