'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Weapons', {
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
            WeaponTypeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'WeaponTypes',
                    key: 'id'
                }
            },
            WeaponStatusId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'WeaponStatuses',
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
        return queryInterface.dropTable('Weapons');
    }
};
