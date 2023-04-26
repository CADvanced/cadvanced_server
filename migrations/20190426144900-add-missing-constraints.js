module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Calls', 'CallGradeId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('Calls', 'CallTypeId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('CallDescriptions', 'CallId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('CallUnits', 'CallId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('CallUnits', 'UnitId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('UserRoles', 'UserId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('UserRoles', 'UserTypeId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('UserUnits', 'UnitId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('UserUnits', 'UserId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('UserUnits', 'UserRankId', {
                type: Sequelize.INTEGER,
                allowNull: false
            }),
            queryInterface.changeColumn('Users', 'userName', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.changeColumn('Users', 'steamId', {
                type: Sequelize.STRING,
                allowNull: false
            }),
            queryInterface.changeColumn('Users', 'avatarUrl', {
                type: Sequelize.TEXT,
                allowNull: false
            })
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Calls', 'CallGradeId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('Calls', 'CallTypeId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('CallDescriptions', 'CallId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('CallUnits', 'CallId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('CallUnits', 'UnitId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('UserRoles', 'UserId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('UserRoles', 'UserTypeId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('UserUnits', 'UnitId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('UserUnits', 'UserId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('UserUnits', 'UserRankId', {
                type: Sequelize.INTEGER,
                allowNull: true
            }),
            queryInterface.changeColumn('Users', 'userName', {
                type: Sequelize.STRING,
                allowNull: true
            }),
            queryInterface.changeColumn('Users', 'steamId', {
                type: Sequelize.STRING,
                allowNull: true
            }),
            queryInterface.changeColumn('Users', 'avatarUrl', {
                type: Sequelize.TEXT,
                allowNull: true
            })
        ]);
    }
};
