'use strict';
export default (sequelize, DataTypes) => {
    const Vehicle = sequelize.define(
        'Vehicle',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            licencePlate: {
                type: DataTypes.STRING
            },
            colour: {
                type: DataTypes.STRING
            }
        },
        {}
    );
    Vehicle.associate = function (models) {
        models.Vehicle.belongsTo(models.VehicleModel, {
            foreignKey: {
                name: 'VehicleModelId',
                allowNull: false
            }
        });
        models.Vehicle.belongsTo(models.InsuranceStatus, {
            foreignKey: {
                name: 'InsuranceStatusId',
                allowNull: false
            }
        });
        models.Vehicle.belongsToMany(models.Marker, {
            through: 'VehicleMarker',
            foreignKey: { name: 'VehicleId', allowNull: false },
            onDelete: 'cascade'
        });
    };
    return Vehicle;
};
