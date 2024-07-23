import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../config/prisma';
import config from '../config/config';

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: Role;
    };
}

const authorize = (role: Role) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !(role == req.user.role)) {
            return res.status(403).json({
                status: 'Forbidden',
                message: 'You do not have permission to access this resource',
                statusCode: 403,
            });
        }
        next();
    };
};

export default authorize;
