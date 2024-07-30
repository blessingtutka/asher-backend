import { Request } from 'express';
import { Role, EmpType, JobType, JobStatus, ApplicationStatus } from '../config/prisma';

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
    image?: string;
    description?: string;
    localisation?: string;
    status?: JobStatus;
    jobCategory?: string;
    jobType?: JobType;
    salary?: string;
    posterId: string;
}

export interface requestBodyApply {
    jobId: string;
    workerId: string;
    status?: ApplicationStatus;
    link?: string;
    cv?: string;
    motivation?: string;
}
