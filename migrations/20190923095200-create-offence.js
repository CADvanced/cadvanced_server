'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Offences', {
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
            CitizenId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Citizens',
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
        return queryInterface.dropTable('Offences');
    }
};
