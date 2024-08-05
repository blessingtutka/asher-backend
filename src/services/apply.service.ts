import prisma from '../config/prisma';
import { requestBodyApply } from '../interfaces/interfaces';
import { ApplicationStatus } from '../config/prisma';

const applicationTable = prisma.application;

const getApplication = async (applicationId: string) => {
    try {
        const application = await applicationTable.findUnique({
            where: { id: applicationId },
            include: { worker: { include: { user: true } }, job: { include: { employer: true } } },
        });
        return application;
    } catch {
        throw new Error('Error fetching application');
    }
};

const getAllApplications = async () => {
    try {
        const applications = await applicationTable.findMany({ include: { worker: true, job: true } });
        return applications;
    } catch {
        throw new Error('Error fetching applications');
    }
};

const getAuthWorkerApplications = async (userId: string) => {
    try {
        const applications = await applicationTable.findMany({
            where: {
                worker: {
                    userId: userId,
                },
            },
            include: { worker: true, job: true },
        });
        return applications;
    } catch {
        throw new Error('Error fetching applications for authenticated worker');
    }
};

const getAuthEmployerJobApplications = async (userId: string, jobId: string) => {
    try {
        const applications = await applicationTable.findMany({
            where: {
                jobId: jobId,
                job: {
                    employer: {
                        userId: userId,
                    },
                },
            },
            include: { worker: true, job: true },
        });
        return applications;
    } catch {
        throw new Error('Error fetching applications for job');
    }
};

const createApplication = async (body: requestBodyApply) => {
    try {
        const application = await applicationTable.create({
            data: body,
        });
        return application;
    } catch (error) {
        throw new Error('Error creating application');
    }
};

const updateApplication = async (applicationId: string, body: requestBodyApply) => {
    try {
        const application = await applicationTable.update({
            where: { id: applicationId },
            data: body,
        });
        return application;
    } catch (error) {
        throw new Error('Error updating application');
    }
};

const deleteApplication = async (applicationId: string) => {
    try {
        await applicationTable.delete({
            where: { id: applicationId },
        });
    } catch (error) {
        throw new Error('Error deleting application');
    }
};

const changeApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    try {
        const application = await applicationTable.update({
            where: { id: applicationId },
            data: { status },
        });
        return application;
    } catch (error) {
        throw new Error('Error updating application status');
    }
};

export {
    getApplication,
    getAllApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    getAuthWorkerApplications,
    getAuthEmployerJobApplications,
    changeApplicationStatus,
};
