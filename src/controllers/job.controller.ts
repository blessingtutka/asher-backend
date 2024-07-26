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
            return res.status(200).json({
                status: 'Success',
                message: 'Job retrieved successfully',
                data: job,
            });
        } else {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Job not found',
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: 'Error fetching job',
        });
    }
};

const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await jobService.getAllJobs();
        return res.status(200).json({
            status: 'Success',
            message: 'Jobs retrieved successfully',
            data: jobs,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: 'Error fetching jobs',
        });
    }
};

const getAuthEmployerJobs = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user;
        if (user) {
            const jobs = await jobService.getAuthEmployerJobs(user.userId);
            res.json(jobs);
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching jobs for authenticated employer' });
    }
};

const createJob = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: "You don't have access",
        });
    }

    const errors = await validateJob(req.body);
    if (errors.length > 0) return res.status(422).json({ errors });

    try {
        const employer = await getAuthEmployer(user.userId);
        const data = { ...req.body, posterId: employer?.id };

        const job = await jobService.createJob(data);
        return res.status(201).json({
            status: 'Success',
            message: 'Job created successfully',
            data: job,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: 'Error creating job',
        });
    }
};

const updateJob = async (req: AuthenticatedRequest, res: Response) => {
    const errors = await validateJob(req.body);
    if (errors.length > 0) return res.status(422).json({ errors });

    const user = req.user;

    if (!user) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: "You don't have access",
        });
    }

    try {
        const { id } = req.params;
        const job = await jobService.getJob(id);

        if (job?.employer.userId !== user.userId) {
            return res.status(403).json({ error: 'Forbidden', message: 'Operation Denied' });
        }

        const updatedJob = await jobService.updateJob(id, req.body);
        return res.status(200).json({
            status: 'Success',
            message: 'Job updated successfully',
            data: updatedJob,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: 'Error updating job',
        });
    }
};

const deleteJob = async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: "You don't have access",
        });
    }

    try {
        const { id } = req.params;
        const job = await jobService.getJob(id);

        if (job?.employer.userId !== user.userId) {
            return res.status(403).json({ error: 'Forbidden', message: 'Operation Denied' });
        }

        await jobService.deleteJob(id);
        return res.status(200).json({
            status: 'Success',
            message: 'Job deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: 'Error deleting job',
        });
    }
};

export { getJob, getAllJobs, getAuthEmployerJobs, createJob, updateJob, deleteJob };
