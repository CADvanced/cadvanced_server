'use strict';

module.exports = {
    up: queryInterface => {
        return Promise.all([
            queryInterface.bulkInsert('Maps', [
                {
                    id: 'f49debda-9724-4e01-946c-6c1a114a2dd5',
                    name: 'Default',
                    active: true,
                    processed: true,
                    readonly: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
        ]);
    },

    down: (queryInterface, Sequelize) => {}
};
