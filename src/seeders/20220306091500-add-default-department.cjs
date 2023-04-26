'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert({ tableName: 'Departments' }, [
            {
                id: 1,
                name: 'CADvanced Police Department',
                colour: '03a9f4',
                readonly: true,
                bolo: true,
                createdAt: Sequelize.fn('NOW'),
                updatedAt: Sequelize.fn('NOW')
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {}
};
