export default (sequelize, DataTypes) => {
    const Department = sequelize.define('Department', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: { type: DataTypes.STRING, allowNull: false },
        colour: { type: DataTypes.STRING, allowNull: false },
        logo: { type: DataTypes.TEXT, allowNull: true },
        readonly: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        bolo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    });
    return Department;
};
