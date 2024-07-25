import prisma, { EmpType } from '../config/prisma';

const workerTable = prisma.worker;

interface requestBody {
    firstName?: string;
    lastName?: string;
    bio?: string;
    title?: string;
    cvFile?: string;
    activity?: string;
    address?: string;
    telephone?: string;
}

const getWorker = async (workerId: string) => {
    try {
        const worker = await workerTable.findUnique({
            where: {
                id: workerId,
            },
        });
        if (!worker) {
            throw new Error(`Worker not found`);
        }
        return worker;
    } catch {
        throw new Error(`Error fetching user`);
    }
};

const createUpdateWorkerProfile = async (userId: string, body: requestBody) => {
    try {
        const hasProfile = await workerTable.findUnique({
            where: {
                userId: userId,
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

export { getWorker, createUpdateWorkerProfile, deleteWorkerProfile };
