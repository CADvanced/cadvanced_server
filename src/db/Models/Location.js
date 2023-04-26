export default (sequelize, DataTypes) => {
    const Location = sequelize.define('Location', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        x: { type: DataTypes.FLOAT },
        y: { type: DataTypes.FLOAT },
        code: { type: DataTypes.STRING },
        readonly: { type: DataTypes.BOOLEAN }
    });

    Location.associate = function (models) {
        models.Location.belongsToMany(models.Call, {
            through: 'CallLocation',
            foreignKey: { name: 'LocationId', allowNull: false }
        });
    };

    return Location;
};
