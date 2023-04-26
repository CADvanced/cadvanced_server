module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('CallDescriptions', 'CallId', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Call',
                    key: 'id'
                },
                allowNull: false,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('CallDescriptions', 'CallId', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Call',
                    key: 'id'
                },
                allowNull: false,
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            })
        ]);
    }
};
