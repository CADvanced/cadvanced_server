'use strict';
export default (sequelize, DataTypes) => {
    const InsuranceStatus = sequelize.define(
        'InsuranceStatus',
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
    return InsuranceStatus;
};
