'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Citizens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            postalCode: {
                type: Sequelize.STRING
            },
            dateOfBirth: {
                type: Sequelize.STRING
            },
            weight: {
                type: Sequelize.STRING
            },
            height: {
                type: Sequelize.STRING
            },
            hair: {
                type: Sequelize.STRING
            },
            eyes: {
                type: Sequelize.STRING
            },
            UserId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            GenderId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Genders',
                    key: 'id'
                }
            },
            EthnicityId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Ethnicities',
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
        return queryInterface.dropTable('Citizens');
    }
};
