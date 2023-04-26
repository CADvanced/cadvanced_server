'use strict';
export default (sequelize, DataTypes) => {
    const Licence = sequelize.define(
        'Licence',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            }
        },
        {}
    );
    Licence.associate = function (models) {
        models.Licence.belongsTo(models.LicenceType, {
            foreignKey: {
                name: 'LicenceTypeId',
                allowNull: false
            }
        });
        models.Licence.belongsTo(models.LicenceStatus, {
            foreignKey: {
                name: 'LicenceStatusId',
                allowNull: false
            }
        });
    };
    return Licence;
};
