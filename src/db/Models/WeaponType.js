'use strict';
export default (sequelize, DataTypes) => {
    const WeaponType = sequelize.define(
        'WeaponType',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: DataTypes.STRING
        },
        {}
    );
    return WeaponType;
};
