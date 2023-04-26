'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Licences', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            CitizenId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Citizens',
                    key: 'id'
                }
            },
            LicenceTypeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'LicenceTypes',
                    key: 'id'
                }
            },
            LicenceStatusId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'LicenceStatuses',
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
        return queryInterface.dropTable('Licences');
    }
};
