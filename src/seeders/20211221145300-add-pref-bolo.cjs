'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert({ tableName: 'Preferences' }, [
            {
                key: 'enable_bolo',
                value: '',
                name: 'Enable BOLO',
                desc: 'Enable BOLO in CAD and MDT',
                type: 'boolean',
                createdAt: Sequelize.fn('NOW'),
                updatedAt: Sequelize.fn('NOW')
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {}
};
