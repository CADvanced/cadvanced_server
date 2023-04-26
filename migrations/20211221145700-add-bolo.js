'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Bolos', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            boloType: {
                type: Sequelize.STRING,
                allowNull: false
            },
            details: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            officer: {
                type: Sequelize.INTEGER,
                allowNull: true,
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
        return queryInterface.dropTable('Bolos');
    }
};
