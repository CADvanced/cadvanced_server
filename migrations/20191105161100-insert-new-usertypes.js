module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('UserTypes', [
            {
                name: 'Manage legal values',
                code: 'LEGAL_MGR',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {}
};
