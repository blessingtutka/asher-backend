import { Request, Response } from 'express';
import * as workerExperienceService from '../services/experience.service';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import { getAuthWorker } from '../services/worker.service';

const getWorkerExperiences = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const experience = await workerExperienceService.getWorkerExperience(id);
        if (experience) {
            const response = {
                status: 'success',
                message: 'Worker experience retrieved successfully',
                data: experience,
                status_code: 200,
            };
            return res.status(response.status_code).json(response);
        } else {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Worker experience not found',
                },
                status_code: 404,
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching worker experience',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const createWorkerExperience = async (req: AuthenticatedRequest, res: Response) => {
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
        const worker = await getAuthWorker(user.userId);
        if (!worker) {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Worker not found',
                },
                status_code: 404,
            });
        }
        const experience = await workerExperienceService.createWorkerExperience(worker.id, req.body);
        const response = {
            status: 'success',
            message: 'Worker experience created successfully',
            data: experience,
            status_code: 201,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error creating worker experience',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const deleteWorkerExperience = async (req: AuthenticatedRequest, res: Response) => {
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
        const { id } = req.params;
        const experience = await workerExperienceService.getWorkerExperience(id);

        if (experience?.worker.userId !== user.userId) {
            return res.status(403).json({
                status: 'error',
                error: {
                    code: 'Forbidden',
                    message: 'Operation Denied',
                },
                status_code: 403,
            });
        }

        await workerExperienceService.deleteWorkerExperience(id);
        const response = {
            status: 'success',
            message: 'Worker experience deleted successfully',
            status_code: 201,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error deleting worker experience',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

export { getWorkerExperiences, createWorkerExperience, deleteWorkerExperience };
