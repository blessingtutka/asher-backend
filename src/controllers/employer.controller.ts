import { getEmployer, createUpdateEmployerProfile } from '../services/employer.service';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/request';

const getEmployerProfile = (req: AuthenticatedRequest, res: Response) => {
    try {
        const { empId } = req.params;
        const employer = getEmployer(empId);
        if (employer) {
            const response = {
                status: 'success',
                message: 'Employer profile retrieved successfully',
                data: { ...employer },
            };
            return res.status(200).json(response);
        } else {
            return res.status(404).json({
                status: 'not found',
                message: 'Employer profile not found',
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            message: 'Error fetching employer profile',
            statusCode: 500,
        };
        res.status(responseError.statusCode).json(responseError);
    }
};

const setEmployerProfile = (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;
        if (user) {
            const employer = createUpdateEmployerProfile(user?.userId, req.body);
            if (employer) {
                const response = {
                    status: 'success',
                    message: 'Employer profile retrieved successfully',
                    data: { ...employer },
                };
                return res.status(200).json(response);
            } else {
                return res.status(404).json({
                    status: 'not found',
                    message: 'Employer profile not found',
                });
            }
        }
        return res.status(403).json({ status: 'Unauthorized', message: 'Invalid token', statusCode: 401 });
    } catch (error) {
        const responseError = {
            status: 'error',
            message: 'Error fetching employer profile',
            statusCode: 500,
        };
        res.status(responseError.statusCode).json(responseError);
    }
};

export { getEmployerProfile, setEmployerProfile };
