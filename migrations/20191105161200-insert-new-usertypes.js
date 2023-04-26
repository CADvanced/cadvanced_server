module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('UserTypes', [
            {
                name: 'Manage citizen values',
                code: 'CITIZEN_VAL_MGR',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {}
};
