'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('DepartmentDocuments', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            filepath: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            DepartmentId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Departments',
                    key: 'id'
                },
                allowNull: false,
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('DepartmentDocuments');
    }
};
