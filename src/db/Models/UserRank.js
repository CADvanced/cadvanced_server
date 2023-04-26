export default (sequelize, DataTypes) => {
    const UserRank = sequelize.define('UserRank', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        position: { type: DataTypes.INTEGER, allowNUll: false },
        DepartmentId: { type: DataTypes.INTEGER }
    });

    return UserRank;
};
