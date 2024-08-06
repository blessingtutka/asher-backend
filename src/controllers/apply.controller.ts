import { Request, Response } from 'express';
import * as applicationService from '../services/apply.service';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import { getAuthWorker } from '../services/worker.service';
import { validateEmplopyerApplicationStatus, validateWorkerApplication } from '../utils/validations';
import { ApplicationStatus } from '../config/prisma';

const getApplication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const application = await applicationService.getApplication(id);
        if (application) {
            const response = {
                status: 'success',
                message: 'Application retrieved successfully',
                data: application,
                status_code: 200,
            };
            return res.status(response.status_code).json(response);
        } else {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Application not found',
                },
                status_code: 404,
            });
        }
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching application',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const getAllApplications = async (req: Request, res: Response) => {
    try {
        const applications = await applicationService.getAllApplications();
        const response = {
            status: 'success',
            message: 'Applications retrieved successfully',
            data: applications,
            status_code: 200,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching applications',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const getAuthWorkerApplications = async (req: AuthenticatedRequest, res: Response) => {
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
        const applications = await applicationService.getAuthWorkerApplications(user.userId);
        const response = {
            status: 'success',
            message: 'Applications retrieved successfully',
            data: applications,
            status_code: 200,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching applications',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const getAuthEmployerJobApplications = async (req: AuthenticatedRequest, res: Response) => {
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
        const { jobId } = req.params;
        const applications = await applicationService.getAuthEmployerJobApplications(user.userId, jobId);
        const response = {
            status: 'success',
            message: 'Applications retrieved successfully',
            data: applications,
            status_code: 200,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Internal Server Error',
                message: 'Error fetching applications for job',
            },
            status_code: 500,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const createApplication = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    const errors = await validateWorkerApplication(req.body);
    if (errors.length > 0) return res.status(422).json({ errors });

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

    if (req.files) {
        Object.values(req.files).forEach((files) => {
            const file = files[0];
            req.body[file.fieldname] = file.filename;
        });
    }

    try {
        const worker = await getAuthWorker(user.userId);
        const data = { ...req.body, workerId: worker?.id };
        const application = await applicationService.createApplication(data);
        const response = {
            status: 'success',
            message: 'Application created successfully',
            data: application,
            status_code: 201,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error creating application',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const updateApplication = async (req: AuthenticatedRequest, res: Response) => {
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

    if (req.files) {
        Object.values(req.files).forEach((files) => {
            const file = files[0];
            if (file.filename != 'null') req.body[file.fieldname] = file.filename;
        });
    }

    try {
        const { id } = req.params;
        const application = await applicationService.getApplication(id);

        if (
            application?.worker.userId !== user.userId ||
            application.status == ApplicationStatus.ACCEPTED ||
            application.status == ApplicationStatus.REJECTED
        ) {
            return res.status(403).json({
                status: 'error',
                error: {
                    code: 'Forbidden',
                    message: 'Operation Denied',
                },
                status_code: 403,
            });
        }
        const updateApplication = await applicationService.updateApplication(id, req.body);
        const response = {
            status: 'success',
            message: 'Application updated successfully',
            data: updateApplication,
            status_code: 201,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error updating application',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const deleteApplication = async (req: AuthenticatedRequest, res: Response) => {
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

        const application = await applicationService.getApplication(id);

        if (application?.worker.userId !== user.userId || application.status == ApplicationStatus.ACCEPTED) {
            return res.status(403).json({
                status: 'error',
                error: {
                    code: 'Forbidden',
                    message: 'Operation Denied',
                },
                status_code: 403,
            });
        }

        await applicationService.deleteApplication(id);
        const response = {
            status: 'success',
            message: 'Application deleted successfully',
            status_code: 201,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error deleting application',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

const changeApplicationStatus = async (req: AuthenticatedRequest, res: Response) => {
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
        const { status } = req.body;

        if (![ApplicationStatus.PENDING, ApplicationStatus.REJECTED, ApplicationStatus.ACCEPTED].includes(status)) {
            return res.status(400).json({
                status: 'error',
                error: {
                    code: 'Bad Request',
                    message: 'Invalid status',
                },
                status_code: 400,
            });
        }

        const application = await applicationService.getApplication(id);

        if (!application) {
            return res.status(404).json({
                status: 'error',
                error: {
                    code: 'Not Found',
                    message: 'Application not found',
                },
                status_code: 404,
            });
        }

        if (application.job.employer.userId !== user.userId) {
            return res.status(403).json({
                status: 'error',
                error: {
                    code: 'Forbidden',
                    message: 'Operation Denied',
                },
                status_code: 403,
            });
        }

        const updatedApplication = await applicationService.changeApplicationStatus(id, status);
        const response = {
            status: 'success',
            message: 'Application status updated successfully',
            data: updatedApplication,
            status_code: 200,
        };
        return res.status(response.status_code).json(response);
    } catch (error) {
        const responseError = {
            status: 'error',
            error: {
                code: 'Bad Request',
                message: 'Error updating application status',
            },
            status_code: 400,
        };
        return res.status(responseError.status_code).json(responseError);
    }
};

export {
    getApplication,
    getAllApplications,
    getAuthWorkerApplications,
    getAuthEmployerJobApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    changeApplicationStatus,
};
