'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            { tableName: 'Preferences' },
            [
                {
                    key: 'enable_fivem',
                    value: 'false',
                    name: 'Install FiveM plugin',
                    desc: 'Allows CADvanced to communicate with your FiveM server to provide in-CAD manipulation of players and in-game updates of CAD actions',
                    type: 'boolean',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    key: 'fivem_server_ip',
                    value: '',
                    name: 'IP address of FiveM server',
                    desc: 'If you enabled the "Install FiveM plugin" preference above, provide the IP address of your FiveM server, e.g. 123.45.67.89',
                    type: 'text',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    key: 'fivem_server_port',
                    value: '',
                    name: 'Port of FiveM server',
                    desc: 'If you enabled the "Install FiveM plugin" preference above, provide the port of your FiveM server, e.g. 30120',
                    type: 'text',
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
