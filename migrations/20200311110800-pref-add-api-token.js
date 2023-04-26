'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            { tableName: 'Preferences' },
            [
                {
                    key: 'api_token',
                    value: '',
                    name: 'API token',
                    desc: 'The authorisation token used by FiveM to make requests to the CAD, this should match what is set in your FiveM CADvanced resource',
                    type: 'text',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                }
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {}
};
