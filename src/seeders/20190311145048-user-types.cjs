'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            { tableName: 'UserTypes' },
            [
                {
                    name: 'Player',
                    code: 'PLAYER',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Roleplay as Citizen',
                    code: 'RP_CITIZEN',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Roleplay as Officer',
                    code: 'RP_OFFICER',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: "Manage own citizen's criminal record",
                    code: 'OWN_CITIZENS_RECORD',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dispatcher',
                    code: 'DISPATCHER',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Manage call values',
                    code: 'CALL_MGR',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Manage unit values',
                    code: 'UNIT_MGR',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Manage officer values',
                    code: 'OFFICER_MGR',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Manage all citizens',
                    code: 'CITIZEN_MGR',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Manage preferences',
                    code: 'PREF_MGR',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Manage users',
                    code: 'USER_MGR',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Manage legal values',
                    code: 'LEGAL_MGR',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Manage citizen values',
                    code: 'CITIZEN_VAL_MGR',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Manage maps',
                    code: 'MAPS_MGR',
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
