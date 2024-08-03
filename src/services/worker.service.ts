import prisma from '../config/prisma';
import { requestBodyWorker } from '../interfaces/interfaces';

const workerTable = prisma.worker;

const getWorker = async (workerId: string) => {
    try {
        const worker = await workerTable.findUnique({
            where: {
                id: workerId,
            },
        });
        return worker;
    } catch {
        throw new Error(`Error fetching user`);
    }
};

const getAuthWorker = async (userId: string) => {
    try {
        const worker = await workerTable.findUnique({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        });
        return worker;
    } catch {
        throw new Error(`Error fetching Your Profile`);
    }
};

const createUpdateWorkerProfile = async (userId: string, body: requestBodyWorker) => {
    try {
        const hasProfile = await workerTable.findUnique({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        });

        if (hasProfile) {
            const worker = await workerTable.update({
                where: {
                    userId: userId,
                },
                data: { ...body },
            });
            return worker;
        } else {
            const worker = await workerTable.create({
                data: { ...body, userId: userId },
            });
            return worker;
        }
    } catch (error) {
        throw new Error(`Error operating Worker`);
    }
};

const deleteWorkerProfile = async (userId: string) => {
    try {
        await workerTable.delete({
            where: {
                userId: userId,
            },
        });
    } catch (error) {
        throw new Error(`Error deleting Worker`);
    }
};

export { getWorker, getAuthWorker, createUpdateWorkerProfile, deleteWorkerProfile };
