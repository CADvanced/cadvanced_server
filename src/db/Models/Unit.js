export default (sequelize, DataTypes) => {
    const Unit = sequelize.define('Unit', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        callSign: { type: DataTypes.STRING, allowNull: false },
        DepartmentId: { type: DataTypes.INTEGER }
    });

    Unit.associate = function (models) {
        models.Unit.belongsTo(models.UnitType, {
            foreignKey: {
                allowNull: false
            }
        });
        models.Unit.belongsTo(models.UnitState, {
            foreignKey: {
                allowNull: false
            }
        });
        models.Unit.belongsToMany(models.User, {
            through: 'UserUnit',
            as: 'users', // Seems backwards, but it's not!
            foreignKey: { name: 'UnitId', allowNull: false }
        });
        models.Unit.belongsToMany(models.Call, {
            through: 'CallUnit',
            foreignKey: { name: 'UnitId', allowNull: false }
        });
    };

    return Unit;
};
