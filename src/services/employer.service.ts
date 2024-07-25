import prisma, { EmpType } from '../config/prisma';

const employerTable = prisma.employer;

interface requestBody {
    profile?: string;
    name?: string;
    description?: string;
    type?: EmpType;
    bio?: string;
    activity?: string;
    address?: string;
    telephone?: string;
}

const getEmployer = async (empId: string) => {
    try {
        const employer = await employerTable.findUnique({
            where: {
                id: empId,
            },
        });
        if (!employer) {
            throw new Error(`Employer not found`);
        }
        return employer;
    } catch {
        throw new Error(`Error fetching user`);
    }
};

const createUpdateEmployerProfile = async (userId: string, body: requestBody) => {
    try {
        const hasProfile = await employerTable.findUnique({
            where: {
                userId: userId,
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

export { getEmployer, createUpdateEmployerProfile, deleteEmployerProfile };
