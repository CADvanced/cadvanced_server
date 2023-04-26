'use strict';
export default (sequelize, DataTypes) => {
    const Map = sequelize.define(
        'Map',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false
            },
            name: DataTypes.STRING,
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            processed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            readonly: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {}
    );
    return Map;
};
