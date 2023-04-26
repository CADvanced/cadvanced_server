'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.createTable('Maps', {
                id: {
                    type: Sequelize.UUID,
                    primaryKey: true,
                    allowNull: false
                },
                name: Sequelize.STRING,
                active: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                processed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                readonly: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
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
            await queryInterface.bulkInsert(
                { tableName: 'Maps' },
                [
                    {
                        id: 'f49debda-9724-4e01-946c-6c1a114a2dd5',
                        name: 'Default',
                        active: true,
                        processed: true,
                        readonly: true,
                        createdAt: Sequelize.fn('NOW'),
                        updatedAt: Sequelize.fn('NOW')
                    }
                ],
                {}
            );
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Maps');
    }
};
