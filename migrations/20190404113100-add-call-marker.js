module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('Calls', 'markerX', Sequelize.DOUBLE),
            queryInterface.addColumn('Calls', 'markerY', Sequelize.DOUBLE)
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('Calls', 'markerX'),
            queryInterface.removeColumn('Calls', 'markerY')
        ]);
    }
};
