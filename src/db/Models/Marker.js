'use strict';
export default (sequelize, DataTypes) => {
    const Marker = sequelize.define(
        'Marker',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: DataTypes.STRING,
            type: {
                type: DataTypes.ENUM,
                values: ['citizen', 'vehicle']
            }
        },
        {}
    );
    Marker.associate = function (models) {
        models.Marker.belongsToMany(models.Citizen, {
            through: 'CitizenMarker',
            foreignKey: { name: 'MarkerId', allowNull: false },
            onDelete: 'cascade'
        });
        models.Marker.belongsToMany(models.Vehicle, {
            through: 'VehicleMarker',
            foreignKey: { name: 'MarkerId', allowNull: false },
            onDelete: 'cascade'
        });
    };
    return Marker;
};
