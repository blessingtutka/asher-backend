import prisma from '../config/prisma';
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
        const jobs = await jobTable.findMany();
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

export { getJob, getAllJobs, createJob, updateJob, deleteJob, getAuthEmployerJobs };
