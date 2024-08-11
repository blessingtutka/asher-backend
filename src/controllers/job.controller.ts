import { Request, Response } from 'express';
import * as jobService from '../services/job.service';
import { getAuthEmployer } from '../services/employer.service';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import { validateJob } from '../utils/validations';

const getJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await jobService.getJob(id);
        if (job) {
            const response = {
                status: 'success',
                message: 'Job retrieved successfully',
                data: job,
                status_code: 200,
            };
            return res.status(response.status_code).json(response);
        } else {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Job not found',
                },
                status_code: 404,
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching job',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await jobService.getAllJobs();
        const response = {
            status: 'success',
            message: 'Jobs retrieved successfully',
            data: jobs,
            status_code: 200,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching jobs',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const getAuthEmployerJobs = async (req: AuthenticatedRequest, res: Response) => {
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
        const jobs = await jobService.getAuthEmployerJobs(user.userId);
        const response = {
            status: 'Success',
            message: 'Jobs retrieved successfully',
            data: jobs,
            status_code: 200,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching jobs',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const createJob = async (req: AuthenticatedRequest, res: Response) => {
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

    const errors = await validateJob(req.body);
    if (errors.length > 0) return res.status(422).json({ errors });

    if (req.file) {
        const file = req.file;
        if (file.filename != 'null') req.body[file.fieldname] = file.filename;
    }

    try {
        const employer = await getAuthEmployer(user.userId);
        const data = { ...req.body, posterId: employer?.id };
        const job = await jobService.createJob(data);

        const response = {
            status: 'success',
            message: 'Job created successfully',
            data: job,
            status_code: 201,
        };

        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error creating job',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const updateJob = async (req: AuthenticatedRequest, res: Response) => {
    const errors = await validateJob(req.body);
    if (errors.length > 0) return res.status(422).json({ errors });

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

    if (req.file) {
        const file = req.file;
        if (file.filename != 'null') req.body[file.fieldname] = file.filename;
    }

    try {
        const { id } = req.params;
        const job = await jobService.getJob(id);

        if (job?.employer.userId !== user.userId) {
            return res.status(403).json({
                status: 'error',
                error: {
                    code: 'Forbidden',
                    message: 'Operation Denied',
                },
                status_code: 403,
            });
        }

        const updatedJob = await jobService.updateJob(id, req.body);
        const response = {
            status: 'success',
            message: 'Job updated successfully',
            data: updatedJob,
            status_code: 201,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error updating Job',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const deleteJob = async (req: AuthenticatedRequest, res: Response) => {
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
        const job = await jobService.getJob(id);

        if (job?.employer.userId !== user.userId) {
            return res.status(403).json({
                status: 'error',
                error: {
                    code: 'Forbidden',
                    message: 'Operation Denied',
                },
                status_code: 403,
            });
        }

        await jobService.deleteJob(id);
        const response = {
            status: 'success',
            message: 'Job deleted successfully',
            data: job,
            status_code: 201,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error deleting Job',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const searchJobs = async (req: Request, res: Response) => {
    const { name, category } = req.query;

    try {
        const jobs = await jobService.searchJobs(name as string, category as string);

        const response = {
            status: 'success',
            message: 'Jobs retrieved successfully',
            data: jobs,
            status_code: 200,
        };

        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error searching jobs',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

export { getJob, getAllJobs, getAuthEmployerJobs, createJob, updateJob, deleteJob, searchJobs };
