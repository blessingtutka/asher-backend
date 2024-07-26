import { getWorker, createUpdateWorkerProfile, getAuthWorker } from '../services/worker.service';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/interfaces';

const getWorkerProfile = async (req: Request, res: Response) => {
    try {
        const { workerId } = req.params;
        const worker = await getWorker(workerId);
        if (worker) {
            const response = {
                status: 'success',
                message: 'Worker profile retrieved successfully',
                data: { ...worker },
                status_code: 200,
            };
            return res.status(response.status_code).json(response);
        } else {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Worker profile not found',
                },
                status_code: 404,
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching Worker profile',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const getYourWorkerProfile = async (req: AuthenticatedRequest, res: Response) => {
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
        const worker = await getAuthWorker(user?.userId);
        if (worker) {
            const response = {
                status: 'success',
                message: 'Worker profile retrieved successfully',
                data: { ...worker },
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
                message: 'Error fetching worker profile',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const setWorkerProfile = async (req: AuthenticatedRequest, res: Response) => {
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
        const worker = await createUpdateWorkerProfile(user?.userId, req.body);
        if (worker) {
            const response = {
                status: 'success',
                message: 'Worker profile retrieved successfully',
                data: { ...worker },
                status_code: 201,
            };
            return res.status(response.status_code).json(response);
        } else {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Worker profile not found',
                },
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error setting worker profile',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

export { getWorkerProfile, setWorkerProfile, getYourWorkerProfile };
