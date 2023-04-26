export default (sequelize, DataTypes) => {
    const CallDescription = sequelize.define('CallDescription', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        text: { type: DataTypes.TEXT, allowNull: false }
    });

    // We allow nulls on CallDescription.CallId since the description is
    // created, *then* the call ID is set. The cascade of deleting the
    // description when the call is deleted still works
    CallDescription.associate = function (models) {
        models.CallDescription.belongsTo(models.Call, {
            onDelete: 'cascade'
        });
    };

    return CallDescription;
};
