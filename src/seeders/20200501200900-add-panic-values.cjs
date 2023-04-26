'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.bulkInsert({ tableName: 'IncidentTypes' }, [
                {
                    name: 'Officer emergency',
                    code: 'PANIC',
                    readonly: true,
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                }
            ]),
            queryInterface.bulkInsert({ tableName: 'Locations' }, [
                {
                    name: 'Officer emergency',
                    code: 'PANIC',
                    readonly: true,
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                }
            ]),
            queryInterface.bulkInsert({ tableName: 'CallGrades' }, [
                {
                    name: 'Officer emergency',
                    code: 'PANIC',
                    readonly: true,
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                }
            ]),
            queryInterface.bulkInsert({ tableName: 'CallTypes' }, [
                {
                    name: 'Officer emergency',
                    code: 'PANIC',
                    readonly: true,
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                }
            ]),
            queryInterface.bulkInsert({ tableName: 'UnitStates' }, [
                {
                    name: 'Officer emergency',
                    code: 'PANIC',
                    colour: 'e20000',
                    readonly: true,
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                }
            ])
        ]);
    },
    down: (queryInterface, Sequelize) => {}
};
