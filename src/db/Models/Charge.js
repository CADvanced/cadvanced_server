'use strict';
export default (sequelize, DataTypes) => {
    const Charge = sequelize.define(
        'Charge',
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
    Charge.associate = function (models) {
        models.Charge.belongsToMany(models.Arrest, {
            through: 'ArrestCharge',
            foreignKey: { name: 'ChargeId', allowNull: false }
        });
        models.Charge.belongsToMany(models.Offence, {
            through: 'OffenceCharge',
            foreignKey: { name: 'ChargeId', allowNull: false }
        });
    };
    return Charge;
};
