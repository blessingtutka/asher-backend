import { Request, Response } from 'express';
import { Role as UserRole } from '../config/prisma';
import { createUser, verifyUser, getSingleUser } from './auth.service';
import { validateLogin, validateUser } from '../utils/validations';
import { generateToken } from '../utils/generateToken';
import { AuthenticatedRequest } from '../interfaces/interfaces';

interface UserRequest extends Request {
    body: {
        fullName: string;
        email: string;
        password: string;
        role: UserRole;
    };
    params: {
        userId: string;
    };
}

async function register(req: UserRequest, res: Response) {
    const { fullName, email, password, role } = req.body;
    const errors = await validateUser(req.body);
    if (errors.length > 0) return res.status(422).json({ errors });

    try {
        const user = await createUser({ fullName, email, password, role });
        const token = generateToken(user);
        const response = {
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken: token,
                user: user,
            },
        };
        return res.status(201).json(response);
    } catch (error) {
        const responseError = {
            status: 'Bad request',
            message: 'Registration unsuccessful',
            statusCode: 400,
        };
        return res.status(responseError.statusCode).json(responseError);
    }
}

async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    const errors = validateLogin(req.body);
    if (errors.length > 0) return res.status(422).json({ errors });

    try {
        const user = await verifyUser(email, password);

        if (user) {
            const token = generateToken(user);
            const response = {
                status: 'success',
                message: 'Login successful',
                data: {
                    accessToken: token,
                    user: user,
                },
            };
            return res.status(200).json(response);
        } else {
            throw new Error('Bad Credential');
        }
    } catch (error) {
        const responseError = {
            status: 'Bad request',
            message: 'Authentication failed',
            statusCode: 401,
        };
        return res.status(responseError.statusCode).json(responseError);
    }
}

async function userProfile(req: AuthenticatedRequest, res: Response) {
    const currentUser = req.user;
    try {
        if (currentUser) {
            const user = await getSingleUser(currentUser?.userId);
            if (user) {
                const response = {
                    status: 'success',
                    message: 'User found',
                    data: user,
                };
                return res.status(200).json(response);
            } else {
                return res.status(404).json({ message: "This user doesn't exist" });
            }
        }
        return res.status(401).json({
            status: 'Unauthorized',
            message: "You don't have access",
            statusCode: 401,
        });
    } catch (error: any) {
        const responseError = {
            status: 'error',
            message: 'Errer Getting Your User Profile',
            statusCode: 500,
        };
        return res.status(responseError.statusCode).json(responseError);
    }
}

export { register, login, userProfile };
