export default (sequelize, DataTypes) => {
    const UserType = sequelize.define('UserType', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING, allowNull: false }
    });

    UserType.associate = function (models) {
        models.UserType.belongsToMany(models.User, {
            through: 'UserRole',
            as: 'users',
            foreignKey: { name: 'UserTypeId', allowNull: false }
        });
    };

    return UserType;
};
