'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
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

        const defaultValues = toUpdate.map(update => {
            return queryInterface.bulkUpdate(update, { DepartmentId: 1 });
        });

        // Add the foreign key constraint
        const fkUpdates = toUpdate.map(update => {
            return queryInterface.addConstraint(update, {
                fields: ['DepartmentId'],
                type: 'foreign key',
                references: {
                    table: 'Departments',
                    field: 'id'
                },
                allowNull: false,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        });

        const remaining = [
            queryInterface.bulkDelete('Preferences', { key: 'enable_bolo' }),
            queryInterface.bulkInsert(
                { tableName: 'UserTypes' },
                [
                    {
                        name: 'Manage departments',
                        code: 'DEPARTMENTS_MGR',
                        createdAt: Sequelize.fn('NOW'),
                        updatedAt: Sequelize.fn('NOW')
                    }
                ],
                {}
            )
        ];

        return Promise.all([].concat(defaultValues, fkUpdates, remaining));
    },
    down: (queryInterface, Sequelize) => {}
};
