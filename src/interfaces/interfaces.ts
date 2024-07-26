import { Request } from 'express';
import { Role, EmpType, JobType, JobStatus } from '../config/prisma';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: Role;
    };
}

export interface AuthenticatedEmployerBodyRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: Role;
    };
}

export interface requestBodyEmployer {
    profile?: string;
    name?: string;
    description?: string;
    type?: EmpType;
    bio?: string;
    activity?: string;
    address?: string;
    telephone?: string;
}

export interface requestBodyWorker {
    firstName?: string;
    lastName?: string;
    profile?: string;
    bio?: string;
    title?: string;
    cvFile?: string;
    activity?: string;
    address?: string;
    telephone?: string;
}

export interface requestBodyJob {
    title: string;
    description?: string;
    localisation?: string;
    status?: JobStatus;
    jobType?: JobType;
    salary?: string;
    posterId: string;
}
