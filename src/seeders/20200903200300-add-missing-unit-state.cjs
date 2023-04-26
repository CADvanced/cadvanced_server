'use strict';

module.exports = {
    up: queryInterface => {
        return queryInterface.sequelize
            .query('SELECT code FROM "UnitStates" WHERE code = \'PANIC\'')
            .then(rows => {
                if (rows[0].length === 0) {
                    return queryInterface.bulkInsert('UnitStates', [
                        {
                            code: 'PANIC',
                            name: 'Officer emergency',
                            colour: 'e20000',
                            readonly: 'true',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ]);
                }
            });
    },

    down: (queryInterface, Sequelize) => {}
};
