module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('IncidentTypes', 'code', {
                type: Sequelize.STRING
            }),
            queryInterface.addColumn('IncidentTypes', 'readonly', {
                type: Sequelize.BOOLEAN
            }),
            queryInterface.addColumn('Locations', 'code', {
                type: Sequelize.STRING
            }),
            queryInterface.addColumn('Locations', 'readonly', {
                type: Sequelize.BOOLEAN
            }),
            queryInterface.addColumn('CallGrades', 'code', {
                type: Sequelize.STRING
            }),
            queryInterface.addColumn('CallGrades', 'readonly', {
                type: Sequelize.BOOLEAN
            }),
            queryInterface.addColumn('CallTypes', 'code', {
                type: Sequelize.STRING
            }),
            queryInterface.addColumn('CallTypes', 'readonly', {
                type: Sequelize.BOOLEAN
            }),
            queryInterface.addColumn('UnitStates', 'code', {
                type: Sequelize.STRING
            }),
            queryInterface.addColumn('UnitStates', 'readonly', {
                type: Sequelize.BOOLEAN
            })
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('IncidentTypes', 'code'),
            queryInterface.removeColumn('IncidentTypes', 'readonly'),
            queryInterface.removeColumn('Locations', 'code'),
            queryInterface.removeColumn('Locations', 'readonly'),
            queryInterface.removeColumn('CallGrades', 'code'),
            queryInterface.removeColumn('CallGrades', 'readonly'),
            queryInterface.removeColumn('CallTypes', 'code'),
            queryInterface.removeColumn('CallTypes', 'readonly'),
            queryInterface.removeColumn('UnitStates', 'code'),
            queryInterface.removeColumn('UnitStates', 'readonly')
        ]);
    }
};
