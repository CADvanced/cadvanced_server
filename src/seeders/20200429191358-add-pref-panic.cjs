'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert({ tableName: 'Preferences' }, [
            {
                key: 'panic_assigned_unit_states',
                value: '[]',
                name: 'Assigned unit states',
                desc: 'Choose which unit states should be assigned to panic calls',
                type: 'list',
                createdAt: Sequelize.fn('NOW'),
                updatedAt: Sequelize.fn('NOW')
            },
            {
                key: 'panic_assigned_unit_types',
                value: '[]',
                name: 'Assigned unit types',
                desc: 'Choose which unit types should be assigned to panic calls',
                type: 'list',
                createdAt: Sequelize.fn('NOW'),
                updatedAt: Sequelize.fn('NOW')
            },
            {
                key: 'panic_assign_unit_state',
                value: 'true',
                name: 'Set state of users units',
                desc: 'When an officer creates a panic call, set the state of all their units to the panic state',
                type: 'boolean',
                createdAt: Sequelize.fn('NOW'),
                updatedAt: Sequelize.fn('NOW')
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {}
};
