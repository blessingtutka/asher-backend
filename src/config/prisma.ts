import { PrismaClient, Role, EmpType, JobType, JobStatus } from '@prisma/client';
import type { User, Employer, Worker, WorkerExperience, Job, Application } from '@prisma/client';

const prisma = new PrismaClient();

export { User, Role, EmpType, Employer, Worker, WorkerExperience, Job, JobType, JobStatus, Application };

export default prisma;
