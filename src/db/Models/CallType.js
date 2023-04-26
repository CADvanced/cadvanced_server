export default (sequelize, DataTypes) => {
    const CallType = sequelize.define('CallType', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING },
        readonly: { type: DataTypes.BOOLEAN },
        DepartmentId: { type: DataTypes.INTEGER }
    });

    return CallType;
};
