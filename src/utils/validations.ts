import prisma, { User, Role, EmpType } from '../config/prisma';
import { requestBodyEmployer } from '../interfaces/interfaces';
interface ValidationError {
    field: string;
    message: string;
}

interface UserInput {
    email: string;
    fullName: string;
    role: Role;
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
    if (![Role.EMPLOYER, Role.WORKER].includes(user.role)) errors.push({ field: 'role', message: 'Unknown Type' });
    if (!user.role) errors.push({ field: 'role', message: 'User Type is required' });
    if (exists) errors.push({ field: 'email', message: 'Email already exists' });
    return errors;
};

const validateLogin = (user: Partial<UserInput>): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!user.email) errors.push({ field: 'email', message: 'Email is required' });
    if (!user.password) errors.push({ field: 'password', message: 'Password is required' });
    return errors;
};

const validateEmployerSetting = (employer: Partial<requestBodyEmployer>): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (employer.type && ![EmpType.ORGANISATION, EmpType.PERSON].includes(employer.type)) errors.push({ field: 'role', message: 'Unknown Type' });
    return errors;
};

export { validateUser, validateLogin, validateEmployerSetting };
