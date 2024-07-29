import prisma, { EmpType } from '../config/prisma';
import { requestBodyEmployer } from '../interfaces/interfaces';

const employerTable = prisma.employer;

const getEmployer = async (empId: string) => {
    try {
        const employer = await employerTable.findUnique({
            where: {
                id: empId,
            },
            include: {
                user: true,
            },
        });
        return employer;
    } catch {
        throw new Error(`Error fetching Employer`);
    }
};

const getAuthEmployer = async (userId: string) => {
    try {
        const employer = await employerTable.findUnique({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        });
        return employer;
    } catch {
        throw new Error(`Error fetching Your Profile`);
    }
};

const createUpdateEmployerProfile = async (userId: string, body: requestBodyEmployer) => {
    try {
        const hasProfile = await employerTable.findUnique({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        });

        if (hasProfile) {
            const employer = await employerTable.update({
                where: {
                    userId: userId,
                },
                data: { ...body },
            });
            return employer;
        } else {
            const employer = await employerTable.create({
                data: { ...body, userId: userId },
            });
            return employer;
        }
    } catch (error) {
        throw new Error(`Error operating Employer`);
    }
};

const deleteEmployerProfile = async (userId: string) => {
    try {
        await employerTable.delete({
            where: {
                userId: userId,
            },
        });
    } catch (error) {
        throw new Error(`Error deleting Employer`);
    }
};

export { getEmployer, getAuthEmployer, createUpdateEmployerProfile, deleteEmployerProfile };
