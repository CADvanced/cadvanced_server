'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Vehicles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            licencePlate: {
                type: Sequelize.STRING
            },
            colour: {
                type: Sequelize.STRING
            },
            CitizenId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Citizens',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            VehicleModelId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'VehicleModels',
                    key: 'id'
                }
            },
            InsuranceStatusId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'InsuranceStatuses',
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
        return queryInterface.dropTable('Vehicles');
    }
};
