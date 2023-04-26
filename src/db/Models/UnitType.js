export default (sequelize, DataTypes) => {
    const UnitType = sequelize.define('UnitType', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        DepartmentId: { type: DataTypes.INTEGER }
    });

    return UnitType;
};
