export default (sequelize, DataTypes) => {
    const Call = sequelize.define('Call', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        callerInfo: { type: DataTypes.TEXT },
        markerX: { type: DataTypes.DOUBLE },
        markerY: { type: DataTypes.DOUBLE },
        DepartmentId: { type: DataTypes.INTEGER }
    });

    Call.associate = function (models) {
        models.Call.belongsToMany(models.Unit, {
            through: 'CallUnit',
            foreignKey: { name: 'CallId', allowNull: false }
        });
        models.Call.belongsToMany(models.Location, {
            through: 'CallLocation',
            foreignKey: { name: 'CallId', allowNull: false }
        });
        models.Call.belongsToMany(models.IncidentType, {
            through: 'Incident',
            foreignKey: { name: 'CallId', allowNull: false }
        });
        models.Call.belongsTo(models.CallType, {
            foreignKey: {
                allowNull: false
            }
        });
        models.Call.belongsTo(models.CallGrade, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Call;
};
