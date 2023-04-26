module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .removeConstraint('Licences', 'Licences_CitizenId_fkey')
            .then(() =>
                queryInterface
                    .removeConstraint('Offences', 'Offences_CitizenId_fkey')
                    .then(() =>
                        queryInterface
                            .removeConstraint(
                                'Warrants',
                                'Warrants_CitizenId_fkey'
                            )
                            .then(() =>
                                queryInterface
                                    .removeConstraint(
                                        'Weapons',
                                        'Weapons_CitizenId_fkey'
                                    )
                                    .then(() =>
                                        queryInterface
                                            .addConstraint(
                                                'Licences',
                                                ['CitizenId'],
                                                {
                                                    type: 'foreign key',
                                                    name: 'Licences_CitizenId_fkey',
                                                    references: {
                                                        table: 'Citizens',
                                                        field: 'id'
                                                    },
                                                    allowNull: false,
                                                    onDelete: 'CASCADE',
                                                    onUpdate: 'CASCADE'
                                                }
                                            )
                                            .then(() =>
                                                queryInterface
                                                    .addConstraint(
                                                        'Offences',
                                                        ['CitizenId'],
                                                        {
                                                            type: 'foreign key',
                                                            name: 'Offences_CitizenId_fkey',
                                                            references: {
                                                                table: 'Citizens',
                                                                field: 'id'
                                                            },
                                                            allowNull: false,
                                                            onDelete: 'CASCADE',
                                                            onUpdate: 'CASCADE'
                                                        }
                                                    )
                                                    .then(() =>
                                                        queryInterface
                                                            .addConstraint(
                                                                'Warrants',
                                                                ['CitizenId'],
                                                                {
                                                                    type: 'foreign key',
                                                                    name: 'Warrants_CitizenId_fkey',
                                                                    references:
                                                                        {
                                                                            table: 'Citizens',
                                                                            field: 'id'
                                                                        },
                                                                    allowNull: false,
                                                                    onDelete:
                                                                        'CASCADE',
                                                                    onUpdate:
                                                                        'CASCADE'
                                                                }
                                                            )
                                                            .then(() =>
                                                                queryInterface.addConstraint(
                                                                    'Weapons',
                                                                    [
                                                                        'CitizenId'
                                                                    ],
                                                                    {
                                                                        type: 'foreign key',
                                                                        name: 'Weapons_CitizenId_fkey',
                                                                        references:
                                                                            {
                                                                                table: 'Citizens',
                                                                                field: 'id'
                                                                            },
                                                                        allowNull: false,
                                                                        onDelete:
                                                                            'CASCADE',
                                                                        onUpdate:
                                                                            'CASCADE'
                                                                    }
                                                                )
                                                            )
                                                    )
                                            )
                                    )
                            )
                    )
            );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface
            .removeConstraint('Licences', 'Licences_CitizenId_fkey')
            .then(() =>
                queryInterface
                    .removeConstraint('Offences', 'Offences_CitizenId_fkey')
                    .then(() =>
                        queryInterface
                            .removeConstraint(
                                'Warrants',
                                'Warrants_CitizenId_fkey'
                            )
                            .then(() =>
                                queryInterface
                                    .removeConstraint(
                                        'Weapons',
                                        'Weapons_CitizenId_fkey'
                                    )
                                    .then(() =>
                                        queryInterface
                                            .addConstraint(
                                                'Licences',
                                                ['CitizenId'],
                                                {
                                                    type: 'foreign key',
                                                    name: 'Licences_CitizenId_fkey',
                                                    references: {
                                                        table: 'Citizens',
                                                        field: 'id'
                                                    },
                                                    allowNull: false
                                                }
                                            )
                                            .then(() =>
                                                queryInterface
                                                    .addConstraint(
                                                        'Offences',
                                                        ['CitizenId'],
                                                        {
                                                            type: 'foreign key',
                                                            name: 'Offences_CitizenId_fkey',
                                                            references: {
                                                                table: 'Citizens',
                                                                field: 'id'
                                                            },
                                                            allowNull: false
                                                        }
                                                    )
                                                    .then(() =>
                                                        queryInterface
                                                            .addConstraint(
                                                                'Warrants',
                                                                ['CitizenId'],
                                                                {
                                                                    type: 'foreign key',
                                                                    name: 'Warrants_CitizenId_fkey',
                                                                    references:
                                                                        {
                                                                            table: 'Citizens',
                                                                            field: 'id'
                                                                        },
                                                                    allowNull: false
                                                                }
                                                            )
                                                            .then(() =>
                                                                queryInterface.addConstraint(
                                                                    'Weapons',
                                                                    [
                                                                        'CitizenId'
                                                                    ],
                                                                    {
                                                                        type: 'foreign key',
                                                                        name: 'Weapons_CitizenId_fkey',
                                                                        references:
                                                                            {
                                                                                table: 'Citizens',
                                                                                field: 'id'
                                                                            },
                                                                        allowNull: false
                                                                    }
                                                                )
                                                            )
                                                    )
                                            )
                                    )
                            )
                    )
            );
    }
};
