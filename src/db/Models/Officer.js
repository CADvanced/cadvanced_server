'use strict';
export default (sequelize, DataTypes) => {
    const Officer = sequelize.define(
        'Officer',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            firstName: { type: DataTypes.STRING, allowNull: false },
            lastName: { type: DataTypes.STRING, allowNull: false },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            DepartmentId: { type: DataTypes.INTEGER }
        },
        {}
    );
    return Officer;
};
