'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        try {
            const toUpdate = [
                'Units',
                'Calls',
                'CallGrades',
                'CallTypes',
                'IncidentTypes',
                'UnitTypes',
                'UnitStates',
                'Officers',
                'UserRanks',
                'Bolos'
            ];

            // Add the foreign key constraint
            const colUpdates = toUpdate.map(update => {
                return queryInterface.addColumn(update, 'DepartmentId', {
                    type: Sequelize.INTEGER
                });
            });
            return Promise.all(colUpdates);
        } catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('DepartmentDocuments');
    }
};
