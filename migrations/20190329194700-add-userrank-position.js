module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .addColumn('UserRanks', 'position', Sequelize.INTEGER)
            .then(() => {
                let promises = [];
                queryInterface.sequelize
                    .query('SELECT id FROM "UserRanks"')
                    .then(rows => {
                        rows[0].forEach((row, index) => {
                            promises.push(
                                queryInterface.bulkUpdate(
                                    'UserRanks',
                                    { position: index },
                                    { id: row.id }
                                )
                            );
                            return Promise.all(promises).then(() =>
                                queryInterface.changeColumn(
                                    'UserRanks',
                                    'position',
                                    {
                                        type: Sequelize.INTEGER,
                                        allowNull: false
                                    }
                                )
                            );
                        });
                    });
            });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('UserRanks', 'position');
    }
};
