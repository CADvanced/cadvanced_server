export default (sequelize, DataTypes) => {
    const IncidentType = sequelize.define('IncidentType', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING },
        readonly: { type: DataTypes.BOOLEAN },
        DepartmentId: { type: DataTypes.INTEGER }
    });
    IncidentType.associate = function (models) {
        models.IncidentType.belongsToMany(models.Call, {
            through: 'Incident',
            foreignKey: { name: 'IncidentId', allowNull: false }
        });
    };

    return IncidentType;
};
