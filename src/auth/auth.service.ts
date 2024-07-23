import prisma from '../config/prisma';
import { Role as UserRole } from '../config/prisma';
import bcrypt from 'bcrypt';

const userTable = prisma.user;

interface CreateUserInput {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
}

async function getUsers() {
    try {
        const allUsers = await userTable.findMany();
        return allUsers;
    } catch (error: any) {
        throw new Error(`Error fetching users: ${error.message}`);
    } finally {
        await prisma.$disconnect();
    }
}

async function getSingleUser(userId: string) {
    try {
        const user = await userTable.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error(`User not found`);
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error: any) {
        throw new Error(`Error fetching user: ${error.message}`);
    } finally {
        await prisma.$disconnect();
    }
}

async function verifyUser(email: string, password: string) {
    try {
        const user = await userTable.findUnique({
            where: {
                email: email,
            },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        } else {
            return null;
        }
    } catch (error: any) {
        throw new Error(`Error verifying user: ${error.message}`);
    } finally {
        await prisma.$disconnect();
    }
}

async function createUser(input: CreateUserInput) {
    const { fullName, email, password, role } = input;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userTable.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                role: role,
            },
        });

        if (role === UserRole.EMPLOYER) {
            await prisma.employer.create({
                data: {
                    userId: newUser.id,
                },
            });
        } else if (role === UserRole.WORKER) {
            await prisma.worker.create({
                data: {
                    userId: newUser.id,
                },
            });
        }

        return newUser;
    } catch (error: any) {
        throw new Error(`Error creating user: ${error.message}`);
    } finally {
        await prisma.$disconnect();
    }
}

export default getUsers;
export { createUser, getSingleUser, verifyUser };
