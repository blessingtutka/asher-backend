import { getWorker, createUpdateWorkerProfile } from '../services/worker.service';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../interfaces/request';

const getWorkerProfile = (req: Request, res: Response) => {
    try {
        const { workerId } = req.params;
        const worker = getWorker(workerId);
        if (worker) {
            const response = {
                status: 'success',
                message: 'Worker profile retrieved successfully',
                data: { ...worker },
            };
            return res.status(200).json(response);
        } else {
            return res.status(404).json({
                status: 'not found',
                message: 'Worker profile not found',
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            message: 'Error fetching Worker profile',
            statusCode: 500,
        };
        res.status(responseError.statusCode).json(responseError);
    }
};

const setWorkerProfile = (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;
        if (user) {
            const worker = createUpdateWorkerProfile(user?.userId, req.body);
            if (worker) {
                const response = {
                    status: 'success',
                    message: 'Worker profile retrieved successfully',
                    data: { ...worker },
                };
                return res.status(200).json(response);
            } else {
                return res.status(404).json({
                    status: 'not found',
                    message: 'Worker profile not found',
                });
            }
        }
        return res.status(403).json({ status: 'Unauthorized', message: 'Invalid token', statusCode: 401 });
    } catch (error) {
        const responseError = {
            status: 'error',
            message: 'Error fetching worker profile',
            statusCode: 500,
        };
        res.status(responseError.statusCode).json(responseError);
    }
};

export { getWorkerProfile, setWorkerProfile };
