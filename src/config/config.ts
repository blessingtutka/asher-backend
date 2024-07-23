import dotenv from 'dotenv';
dotenv.config();

interface Config {
    port: number;
    databaseUrl: string;
    jwtSecret: string;
    [key: string]: any;
}

const config: Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET || 'asher-secret-key',
};

export default config;
