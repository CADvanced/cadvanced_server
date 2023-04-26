module.exports = {
    up: function up(queryInterface, Sequelize) {
        return queryInterface
            .changeColumn('Preferences', 'type', {
                type: Sequelize.STRING,
                allowNull: false
            })
            .then(() => {
                const pgEnumDropQuery =
                    queryInterface.QueryGenerator.pgEnumDrop(
                        'Preferences',
                        'type'
                    );

                return queryInterface.sequelize.query(pgEnumDropQuery);
            });
    },
    down: function down(queryInterface, Sequelize) {
        return queryInterface
            .changeColumn('Preferences', 'type', {
                type: Sequelize.STRING,
                allowNull: false
            })
            .then(() => {
                const pgEnumDropQuery =
                    queryInterface.QueryGenerator.pgEnumDrop(
                        'Preferences',
                        'type'
                    );

                return queryInterface.sequelize.query(pgEnumDropQuery);
            })
            .then(() => {
                return queryInterface.changeColumn('Preferences', 'type', {
                    type: Sequelize.ENUM('boolean', 'text'),
                    allowNull: false
                });
            });
    }
};
