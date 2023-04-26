export default (sequelize, DataTypes) => {
    const UserUnit = sequelize.define('UserUnit', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
    });

    UserUnit.associate = function (models) {
        models.UserUnit.belongsTo(models.UserRank, {
            onDelete: 'cascade',
            hooks: true,
            foreignKey: { allowNull: false }
        });
    };

    return UserUnit;
};
