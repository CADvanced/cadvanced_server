export default (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
    });

    return UserRole;
};
