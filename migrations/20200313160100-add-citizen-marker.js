'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('CitizenMarker', {
            CitizenId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Citizens',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            MarkerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Markers',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
        return queryInterface.dropTable('CitizenMarker');
    }
};
