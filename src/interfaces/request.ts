import { Request } from 'express';
import { Role } from '../config/prisma';
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
