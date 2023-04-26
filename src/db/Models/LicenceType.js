'use strict';
export default (sequelize, DataTypes) => {
    const LicenceType = sequelize.define(
        'LicenceType',
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
    return LicenceType;
};
