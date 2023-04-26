'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Arrests', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            date: {
                type: Sequelize.STRING
            },
            time: {
                type: Sequelize.STRING
            },
            OffenceId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Offences',
                    key: 'id'
                }
            },
            OfficerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Officers',
                    key: 'id'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Arrests');
    }
};
