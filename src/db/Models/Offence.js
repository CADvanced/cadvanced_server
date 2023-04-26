'use strict';
export default (sequelize, DataTypes) => {
    const Offence = sequelize.define(
        'Offence',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            date: DataTypes.STRING,
            time: DataTypes.STRING,
            location: DataTypes.STRING
        },
        {}
    );
    Offence.associate = function (models) {
        models.Offence.belongsToMany(models.Charge, {
            through: 'OffenceCharge',
            foreignKey: { name: 'OffenceId', allowNull: false }
        });
        models.Offence.hasMany(models.Ticket, {
            foreignKey: {
                name: 'OffenceId',
                allowNull: false
            }
        });
        models.Offence.hasOne(models.Arrest, {
            foreignKey: {
                name: 'OffenceId',
                allowNull: false
            }
        });
    };
    return Offence;
};
