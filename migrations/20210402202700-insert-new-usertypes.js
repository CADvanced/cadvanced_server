module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('UserTypes', [
            {
                name: 'Manage maps',
                code: 'MAPS_MGR',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {}
};
