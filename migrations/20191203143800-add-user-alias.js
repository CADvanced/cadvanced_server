module.exports = {
    up: (queryInterface, Sequelize) => {
        const promises = [
            queryInterface.addColumn('Users', 'alias', Sequelize.STRING)
        ];
        return Promise.all(promises);
    },
    down: (queryInterface, Sequelize) => {}
};
