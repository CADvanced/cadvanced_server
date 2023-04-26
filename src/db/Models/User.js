export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userName: { type: DataTypes.STRING, allowNull: false },
        x: { type: DataTypes.FLOAT },
        y: { type: DataTypes.FLOAT },
        steamId: { type: DataTypes.STRING, unique: true, allowNull: false },
        avatarUrl: { type: DataTypes.TEXT, allowNull: false },
        uuid: { type: DataTypes.UUID },
        alias: { type: DataTypes.STRING }
    });

    User.associate = function (models) {
        models.User.belongsToMany(models.UserType, {
            through: 'UserRole',
            as: 'roles',
            foreignKey: { name: 'UserId', allowNull: false }
        });
        models.User.belongsToMany(models.Unit, {
            through: 'UserUnit',
            as: 'units', // Seems backwards, but it's not
            foreignKey: { name: 'UserId', allowNull: false }
        });
        models.User.hasOne(models.Officer, {
            foreignKey: {
                name: 'UserId',
                allowNull: false,
                onDelete: 'cascade'
            }
        });
        models.User.hasOne(models.Citizen, {
            foreignKey: {
                name: 'UserId',
                allowNull: false,
                onDelete: 'cascade'
            }
        });
    };

    return User;
};
