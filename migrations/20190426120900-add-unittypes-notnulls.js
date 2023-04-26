module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Units', 'UnitTypeId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('Units', 'UnitStateId', {
                type: Sequelize.INTEGER,
                allowNull: false
            })
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Units', 'UnitTypeId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('Units', 'UnitStateId', {
                type: Sequelize.INTEGER,
                allowNull: true
            })
        ]);
    }
};
