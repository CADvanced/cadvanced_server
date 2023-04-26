'use strict';
export default (sequelize, DataTypes) => {
    const WeaponStatus = sequelize.define(
        'WeaponStatus',
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
    return WeaponStatus;
};
