export default (sequelize, DataTypes) => {
    const CallUnit = sequelize.define('CallUnit', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
    });

    return CallUnit;
};
