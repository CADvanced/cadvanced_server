module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Citizens', 'active', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Citizens', 'active');
    }
};
