export default (sequelize, DataTypes) => {
    const CallGrade = sequelize.define('CallGrade', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING },
        readonly: { type: DataTypes.BOOLEAN },
        DepartmentId: { type: DataTypes.INTEGER }
    });

    return CallGrade;
};
