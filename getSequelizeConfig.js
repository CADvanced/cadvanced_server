import * as dotenv from 'dotenv';

dotenv.config();

const mode = process.env.NODE_ENV;

export default {
    [mode]: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: 'cadvanced',
        schema: 'cadvanced',
        host: 'db',
        dialect: 'postgres',
        dialectOptions: {
            prependSearchPath: true
        },
        searchPath: 'cadvanced',
        migrationStorage: 'none'
    }
};
