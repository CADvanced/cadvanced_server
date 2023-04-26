module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .removeConstraint('Officers', 'Officers_UserId_fkey')
            .then(() =>
                queryInterface.addConstraint('Officers', ['UserId'], {
                    type: 'foreign key',
                    name: 'Officers_UserId_fkey',
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
