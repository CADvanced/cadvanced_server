module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('UserTypes', [
            {
                name: 'Roleplay as Citizen',
                code: 'RP_CITIZEN',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Roleplay as Officer',
                code: 'RP_OFFICER',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Manage own citizen's criminal record",
                code: 'OWN_CITIZENS_RECORD',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {}
};
