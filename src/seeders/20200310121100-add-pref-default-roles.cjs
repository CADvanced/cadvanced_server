'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            { tableName: 'Preferences' },
            [
                {
                    key: 'default_roles',
                    value: '[]',
                    name: 'New user roles',
                    desc: 'When new users sign into the CAD for the first time, select the roles they should be given. WARNING: Anyone with the URL of your CAD, whether they are invited or not, will get these roles.',
                    type: 'list',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                }
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {}
};
