'use strict';
export default (sequelize, DataTypes) => {
    const Ticket = sequelize.define(
        'Ticket',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            date: DataTypes.STRING,
            time: DataTypes.STRING,
            location: DataTypes.STRING,
            points: DataTypes.STRING,
            fine: DataTypes.STRING,
            notes: DataTypes.STRING
        },
        {}
    );
    Ticket.associate = function (models) {
        models.Ticket.belongsTo(models.Officer, {
            foreignKey: {
                name: 'OfficerId',
                allowNull: false
            }
        });
        models.Ticket.belongsTo(models.Offence, {
            foreignKey: {
                name: 'OffenceId',
                allowNull: false,
                onDelete: 'cascade',
                onUpdate: 'cascade'
            }
        });
    };
    return Ticket;
};
