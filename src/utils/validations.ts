import prisma, { User } from '../config/prisma';

interface ValidationError {
    field: string;
    message: string;
}

interface UserInput {
    email: string;
    fullName: string;
    password: string;
}

const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const userwithemail = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return userwithemail;
    } catch {
        return null;
    }
};

const validateUser = async (user: UserInput): Promise<ValidationError[]> => {
    const exists = await getUserByEmail(user.email);

    const errors: ValidationError[] = [];
    if (!user.email) errors.push({ field: 'email', message: 'Email is required' });
    if (!user.fullName) errors.push({ field: 'fullName', message: 'Full name is required' });
    if (exists) errors.push({ field: 'email', message: 'Email already exists' });
    return errors;
};

const validateLogin = (user: Partial<UserInput>): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!user.email) errors.push({ field: 'email', message: 'Email is required' });
    if (!user.password) errors.push({ field: 'password', message: 'Password is required' });
    return errors;
};

export { validateUser, validateLogin };
