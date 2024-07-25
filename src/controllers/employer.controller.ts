import { getEmployer, createUpdateEmployerProfile, getAuthEmployer } from '../services/employer.service';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import { validateEmployerSetting } from '../utils/validations';

const getEmployerProfile = async (req: Request, res: Response) => {
    try {
        const { empId } = req.params;
        const employer = await getEmployer(empId);
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
        return res.status(responseError.statusCode).json(responseError);
    }
};

const getYourEmployerProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;
        if (user) {
            const employer = await getAuthEmployer(user?.userId);
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
        return res.status(401).json({
            status: 'Unauthorized',
            message: "You don't have access",
            statusCode: 401,
        });
    } catch (error) {
        const responseError = {
            status: 'error',
            message: 'Error fetching employer profile',
            statusCode: 500,
        };
        return res.status(responseError.statusCode).json(responseError);
    }
};

const setEmployerProfile = async (req: AuthenticatedRequest, res: Response) => {
    const errors = await validateEmployerSetting(req.body);
    if (errors.length > 0) return res.status(422).json({ errors });
    try {
        const user = req.user;
        if (user) {
            const employer = await createUpdateEmployerProfile(user?.userId, req.body);
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
        } else return res.status(403).json({ status: 'Unauthorized', message: "You don't have access", statusCode: 401 });
    } catch (error) {
        const responseError = {
            status: 'error',
            message: 'Error fetching employer profile',
            statusCode: 500,
        };
        return res.status(responseError.statusCode).json(responseError);
    }
};

export { getEmployerProfile, setEmployerProfile, getYourEmployerProfile };
