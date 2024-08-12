import prisma from '../config/prisma';
import { WorkerExperience } from '@prisma/client';
import { requestBodyWorkerExperience } from '../interfaces/interfaces';

const workerExperienceTable = prisma.workerExperience;

const getWorkerExperience = async (expId: string) => {
    try {
        const experiences = await workerExperienceTable.findUnique({
            where: { id: expId },
            include: { worker: true },
        });
        return experiences;
    } catch {
        throw new Error('Error fetching worker experience');
    }
};

const getWorkerExperiences = async (workerId: string): Promise<WorkerExperience[] | null> => {
    try {
        const experiences = await workerExperienceTable.findMany({
            where: { workerId: workerId },
            include: { worker: true },
        });
        return experiences;
    } catch {
        throw new Error('Error fetching worker experience');
    }
};

const createWorkerExperience = async (workerId: string, body: requestBodyWorkerExperience): Promise<WorkerExperience> => {
    try {
        const experience = await workerExperienceTable.create({
            data: { workerId, ...body },
        });
        return experience;
    } catch (error) {
        throw new Error('Error creating worker experience');
    }
};

const deleteWorkerExperience = async (experienceId: string): Promise<void> => {
    try {
        await workerExperienceTable.delete({
            where: { id: experienceId },
        });
    } catch (error) {
        throw new Error('Error deleting worker experience');
    }
};

export { getWorkerExperience, getWorkerExperiences, createWorkerExperience, deleteWorkerExperience };
