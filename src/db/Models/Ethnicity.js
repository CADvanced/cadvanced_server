'use strict';
export default (sequelize, DataTypes) => {
    const Ethnicity = sequelize.define(
        'Ethnicity',
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
    return Ethnicity;
};
