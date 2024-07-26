import prisma, { User, Role, EmpType, JobType, JobStatus, ApplicationStatus } from '../config/prisma';
import { requestBodyEmployer, requestBodyJob, requestBodyApply } from '../interfaces/interfaces';
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

const JOB_TYPES: JobType[] = [JobType.CONTRACT, JobType.FULL_TIME, JobType.INTERN, JobType.PART_TIME, JobType.TEMPORARY];
const JOB_STATUS: JobStatus[] = [JobStatus.OPEN, JobStatus.CLOSE];

const validateJob = (job: Partial<requestBodyJob>): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!job.title) errors.push({ field: 'title', message: 'Job Title is required' });
    if (job.jobType && !JOB_TYPES.includes(job.jobType)) errors.push({ field: 'job_type', message: 'Unknown Type' });
    if (job.status && !JOB_STATUS.includes(job.status)) errors.push({ field: 'status', message: 'Unknown Status' });
    return errors;
};

const APPLICATION_STATUS: ApplicationStatus[] = [ApplicationStatus.PENDING, ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED];
const validateWorkerApplication = (application: Partial<requestBodyApply>): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (application.status) errors.push({ field: 'status', message: 'Your can set the status' });

    return errors;
};

const validateEmplopyerApplicationStatus = (application: Partial<requestBodyApply>): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!application.status) errors.push({ field: 'status', message: 'Status is required' });
    else if (!APPLICATION_STATUS.includes(application.status)) errors.push({ field: 'status', message: 'Unknown Stutus' });

    return errors;
};

export { validateUser, validateLogin, validateEmployerSetting, validateJob, validateWorkerApplication, validateEmplopyerApplicationStatus };
