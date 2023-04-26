'use strict';
export default (sequelize, DataTypes) => {
    const Warrant = sequelize.define(
        'Warrant',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            details: DataTypes.STRING,
            validFrom: DataTypes.STRING,
            validTo: DataTypes.STRING
        },
        {}
    );
    return Warrant;
};
