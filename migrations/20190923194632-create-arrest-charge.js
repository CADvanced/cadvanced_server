'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ArrestCharge', {
            ArrestId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Arrests',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            ChargeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Charges',
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
        return queryInterface.dropTable('ArrestCharge');
    }
};
