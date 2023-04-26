module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.addColumn('UnitStates', 'active', {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }),
    down: (queryInterface, Sequelize) =>
        queryInterface.removeColumn('UnitStates', 'active')
};
