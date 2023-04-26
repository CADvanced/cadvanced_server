module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Officers', 'active', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Officers', 'active');
    }
};
