module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .removeConstraint('Arrests', 'Arrests_OffenceId_fkey')
            .then(() =>
                queryInterface
                    .removeConstraint('Tickets', 'Tickets_OffenceId_fkey')
                    .then(() =>
                        queryInterface
                            .addConstraint('Arrests', ['OffenceId'], {
                                type: 'foreign key',
                                name: 'Arrests_OffenceId_fkey',
                                references: {
                                    table: 'Offences',
                                    field: 'id'
                                },
                                allowNull: false,
                                onDelete: 'CASCADE',
                                onUpdate: 'CASCADE'
                            })
                            .then(() =>
                                queryInterface.addConstraint(
                                    'Tickets',
                                    ['OffenceId'],
                                    {
                                        type: 'foreign key',
                                        name: 'Tickets_OffenceId_fkey',
                                        references: {
                                            table: 'Offences',
                                            field: 'id'
                                        },
                                        allowNull: false,
                                        onDelete: 'CASCADE',
                                        onUpdate: 'CASCADE'
                                    }
                                )
                            )
                    )
            );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeConstraint('Arrests', 'Arrests_OffenceId_fkey')
            .then(() =>
                queryInterface
                    .addConstraint('Arrests', ['OffenceId'], {
                        type: 'foreign key',
                        name: 'Arrests_OffenceId_fkey',
                        references: {
                            table: 'Offences',
                            field: 'id'
                        },
                        allowNull: false,
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    })
                    .then(() =>
                        queryInterface
                            .removeConstraint(
                                'Tickets',
                                'Tickets_OffenceId_fkey'
                            )
                            .then(() =>
                                queryInterface.addConstraint(
                                    'Tickets',
                                    ['OffenceId'],
                                    {
                                        type: 'foreign key',
                                        name: 'Tickets_OffenceId_fkey',
                                        references: {
                                            table: 'Offences',
                                            field: 'id'
                                        },
                                        allowNull: false,
                                        onDelete: 'CASCADE',
                                        onUpdate: 'CASCADE'
                                    }
                                )
                            )
                    )
            );
    }
};
