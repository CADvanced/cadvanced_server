'use strict';
export default (sequelize, DataTypes) => {
    const Weapon = sequelize.define(
        'Weapon',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            }
        },
        {}
    );
    Weapon.associate = function (models) {
        models.Weapon.belongsTo(models.WeaponType, {
            foreignKey: {
                name: 'WeaponTypeId',
                allowNull: false
            }
        });
        models.Weapon.belongsTo(models.WeaponStatus, {
            foreignKey: {
                name: 'WeaponStatusId',
                allowNull: false
            }
        });
    };
    return Weapon;
};
