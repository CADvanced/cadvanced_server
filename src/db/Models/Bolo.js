'use strict';
export default (sequelize, DataTypes) => {
    const Bolo = sequelize.define(
        'Bolo',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            boloType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            details: {
                type: DataTypes.JSONB,
                allowNull: false
            },
            DepartmentId: { type: DataTypes.INTEGER }
        },
        {}
    );
    Bolo.associate = function (models) {
        models.Bolo.belongsTo(models.Officer, {
            foreignKey: {
                name: 'officer',
                allowNull: true
            }
        });
    };
    return Bolo;
};
