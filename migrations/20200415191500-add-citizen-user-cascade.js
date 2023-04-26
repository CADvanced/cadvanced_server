module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .removeConstraint('Citizens', 'Citizens_UserId_fkey')
            .then(() =>
                queryInterface.addConstraint('Citizens', ['UserId'], {
                    type: 'foreign key',
                    name: 'Citizens_UserId_fkey',
                    references: {
                        table: 'Users',
                        field: 'id'
                    },
                    allowNull: false,
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                })
            );
    },
    down: (queryInterface, Sequelize) => {}
};
