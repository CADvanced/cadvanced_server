'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            { tableName: 'Preferences' },
            [
                {
                    key: 'user_picker',
                    value: 'false',
                    name: 'Enable user picker',
                    desc: 'Display the user picker in the dispatcher map. If you are not using the FiveM integration, the user picker will display regardless of this setting.',
                    type: 'boolean',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                }
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity.

        Example:
        return queryInterface.bulkDelete('People', null, {});
        */
    }
};
