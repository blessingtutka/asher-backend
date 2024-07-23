import jwt from 'jsonwebtoken';
import config from '../config/config';
import { User } from '../config/prisma';

export const generateToken = (user: User): string => {
    return jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: '4h',
    });
};
