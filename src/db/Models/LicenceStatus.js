'use strict';
export default (sequelize, DataTypes) => {
    const LicenceStatus = sequelize.define(
        'LicenceStatus',
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
    return LicenceStatus;
};
