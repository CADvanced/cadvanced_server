'use strict';
export default (sequelize, DataTypes) => {
    const VehicleModel = sequelize.define(
        'VehicleModel',
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
    return VehicleModel;
};
