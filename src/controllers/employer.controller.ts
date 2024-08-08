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
                status_code: 200,
            };
            return res.status(response.status_code).json(response);
        } else {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Employer profile not found',
                },
                status_code: 404,
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching employer profile',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const getYourEmployerProfile = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            status: 'error',
            error: {
                code: 'Unauthorized',
                message: "You don't have access",
            },
            status_code: 401,
        });
    }

    try {
        const employer = await getAuthEmployer(user?.userId);
        if (employer) {
            const response = {
                status: 'success',
                message: 'Employer profile retrieved successfully',
                data: { ...employer },
                status_code: 200,
            };
            return res.status(response.status_code).json(response);
        } else {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Employer profile not found',
                },
                status_code: 404,
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching employer profile',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const setEmployerProfile = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            status: 'error',
            error: {
                code: 'Unauthorized',
                message: "You don't have access",
            },
            status_code: 401,
        });
    }

    const errors = await validateEmployerSetting(req.body);
    if (errors.length > 0) return res.status(422).json({ errors });

    if (req.file) {
        const file = req.file;
        if (file.filename != 'null') {
            req.body[file.fieldname] = file.filename;
        }
    }

    try {
        const employer = await createUpdateEmployerProfile(user?.userId, req.body);
        if (employer) {
            const response = {
                status: 'success',
                message: 'Employer profile retrieved successfully',
                data: { ...employer },
                status_code: 201,
            };
            return res.status(response.status_code).json(response);
        } else {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Employer profile not found',
                },
                status_code: 404,
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error setting employer profile',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

export { getEmployerProfile, setEmployerProfile, getYourEmployerProfile };
