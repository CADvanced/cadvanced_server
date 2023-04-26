import Umzug from 'umzug';
import Models from '../db/Models/index.js';


const seedsConfig = {
    storage: 'sequelize',
    storageOptions: {
        sequelize: Models.sequelize,
        modelName: 'SequelizeData' // Or whatever you want to name the seeder storage table
    },
    migrations: {
        params: [
            Models.sequelize.getQueryInterface(),
            Models.sequelize.constructor
        ],
        path: '/usr/src/cadvanced_server/src/seeders',
        pattern: /\.cjs$/
    }
};

export default new Umzug(seedsConfig);
