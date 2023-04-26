'use strict';

module.exports = {
    up: queryInterface => {
        return Promise.all([
            queryInterface.bulkInsert('CallGrades', [
                {
                    name: 'Citizen call',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    readonly: 'true',
                    code: 'CITIZEN_CALL'
                }
            ]),
            queryInterface.bulkInsert('CallTypes', [
                {
                    name: 'Citizen call',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    readonly: 'true',
                    code: 'CITIZEN_CALL'
                }
            ]),
            queryInterface.bulkInsert('IncidentTypes', [
                {
                    name: 'Citizen call',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    code: 'CITIZEN_CALL',
                    readonly: 'true'
                }
            ])
        ]);
    },

    down: (queryInterface, Sequelize) => {}
};
