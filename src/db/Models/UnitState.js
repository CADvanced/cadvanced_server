export default (sequelize, DataTypes) => {
    const UnitState = sequelize.define('UnitState', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        colour: { type: DataTypes.STRING(6), allowNull: false },
        code: { type: DataTypes.STRING },
        readonly: { type: DataTypes.BOOLEAN },
        active: { type: DataTypes.BOOLEAN, defaultValue: true },
        DepartmentId: { type: DataTypes.INTEGER }
    });

    return UnitState;
};
