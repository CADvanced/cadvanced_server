'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tickets', {
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
            location: {
                type: Sequelize.STRING
            },
            points: {
                type: Sequelize.STRING
            },
            fine: {
                type: Sequelize.STRING
            },
            notes: {
                type: Sequelize.STRING
            },
            OfficerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Officers',
                    key: 'id'
                }
            },
            OffenceId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Offences',
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
        return queryInterface.dropTable('Tickets');
    }
};
