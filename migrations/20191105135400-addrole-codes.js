module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('UserTypes', 'code', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('UserTypes', 'code');
    }
};
