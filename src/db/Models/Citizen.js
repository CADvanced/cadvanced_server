'use strict';
export default (sequelize, DataTypes) => {
    const Citizen = sequelize.define(
        'Citizen',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            firstName: { type: DataTypes.STRING, allowNull: false },
            lastName: { type: DataTypes.STRING, allowNull: false },
            address: DataTypes.STRING,
            postalCode: DataTypes.STRING,
            dateOfBirth: DataTypes.STRING,
            weight: DataTypes.STRING,
            height: DataTypes.STRING,
            hair: DataTypes.STRING,
            eyes: DataTypes.STRING,
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {}
    );
    Citizen.associate = function (models) {
        models.Citizen.belongsTo(models.Gender, {
            foreignKey: {
                name: 'GenderId'
            }
        });
        models.Citizen.belongsTo(models.Ethnicity, {
            foreignKey: {
                name: 'EthnicityId'
            }
        });
        models.Citizen.hasMany(models.Offence, {
            foreignKey: {
                name: 'CitizenId',
                allowNull: false
            }
        });
        models.Citizen.hasMany(models.Licence, {
            foreignKey: {
                name: 'CitizenId',
                allowNull: false
            }
        });
        models.Citizen.hasMany(models.Vehicle, {
            foreignKey: {
                name: 'CitizenId',
                allowNull: false
            }
        });
        models.Citizen.hasMany(models.Warrant, {
            foreignKey: {
                name: 'CitizenId',
                allowNull: false
            }
        });
        models.Citizen.hasMany(models.Weapon, {
            foreignKey: {
                name: 'CitizenId',
                allowNull: false
            }
        });
        models.Citizen.belongsToMany(models.Marker, {
            through: 'CitizenMarker',
            foreignKey: { name: 'CitizenId', allowNull: false },
            onDelete: 'cascade'
        });
    };
    return Citizen;
};
