'use strict';
export default (sequelize, DataTypes) => {
    const Arrest = sequelize.define(
        'Arrest',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            date: DataTypes.STRING,
            time: DataTypes.STRING
        },
        {}
    );
    Arrest.associate = function (models) {
        models.Arrest.belongsTo(models.Officer, {
            foreignKey: {
                name: 'OfficerId',
                allowNull: false
            }
        });
        models.Arrest.belongsToMany(models.Charge, {
            through: 'ArrestCharge',
            foreignKey: { name: 'ArrestId', allowNull: false }
        });
    };
    return Arrest;
};
