module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('UserTypes', [
            {
                name: 'Manage all citizens',
                code: 'CITIZEN_MGR',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Manage users',
                code: 'USER_MGR',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {}
};
