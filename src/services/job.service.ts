import prisma from '../config/prisma';
import { JobStatus } from '../config/prisma';
import { requestBodyJob } from '../interfaces/interfaces';

const jobTable = prisma.job;

const getJob = async (jobId: string) => {
    try {
        const job = await jobTable.findUnique({
            where: { id: jobId },
            include: { employer: true },
        });
        return job;
    } catch {
        throw new Error('Error fetching job');
    }
};

const getAllJobs = async () => {
    try {
        const jobs = await jobTable.findMany({
            where: {
                status: JobStatus.OPEN,
            },
            include: { employer: true },
        });
        return jobs;
    } catch {
        throw new Error('Error fetching jobs');
    }
};

const getAuthEmployerJobs = async (userId: string) => {
    try {
        const jobs = await jobTable.findMany({
            where: {
                employer: {
                    userId: userId,
                },
            },
            include: { employer: true },
        });
        return jobs;
    } catch {
        throw new Error('Error fetching jobs for authenticated employer');
    }
};

const createJob = async (body: requestBodyJob) => {
    try {
        const job = await jobTable.create({
            data: body,
        });
        return job;
    } catch (error) {
        throw new Error('Error creating job');
    }
};

const updateJob = async (jobId: string, body: requestBodyJob) => {
    try {
        const job = await jobTable.update({
            where: { id: jobId },
            data: body,
        });
        return job;
    } catch (error) {
        throw new Error('Error updating job');
    }
};

const deleteJob = async (jobId: string) => {
    try {
        await jobTable.delete({
            where: { id: jobId },
        });
    } catch (error) {
        throw new Error('Error deleting job');
    }
};

const searchJobs = async (name?: string, category?: string) => {
    const filters: any = {};

    if (name) {
        filters.title = {
            contains: name,
            mode: 'insensitive',
        };
    }

    if (category) {
        filters.jobCategory = {
            contains: category,
            mode: 'insensitive',
        };
    }

    const jobs = await prisma.job.findMany({
        where: filters,
        include: {
            employer: true,
        },
    });

    return jobs;
};

export { getJob, getAllJobs, createJob, updateJob, deleteJob, getAuthEmployerJobs, searchJobs };
