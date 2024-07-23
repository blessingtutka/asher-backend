import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

interface AuthenticatedRequest extends Request {
    user?: string | jwt.JwtPayload;
}

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: 'No token provided',
            statusCode: 401,
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: 'No token provided',
            statusCode: 401,
        });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            status: 'Unauthorized',
            message: 'Invalid token',
            statusCode: 401,
        });
    }
};

export default authenticate;
