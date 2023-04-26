'use strict';
export default (sequelize, DataTypes) => {
    const Gender = sequelize.define(
        'Gender',
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
    return Gender;
};
