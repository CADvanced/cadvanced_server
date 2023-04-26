module.exports = {
    up: (queryInterface, Sequelize) => {
        const promises = [
            queryInterface.addColumn('Warrants', 'validFrom', Sequelize.STRING),
            queryInterface.addColumn('Warrants', 'validTo', Sequelize.STRING)
        ];
        return Promise.all(promises);
    },
    down: (queryInterface, Sequelize) => {}
};
