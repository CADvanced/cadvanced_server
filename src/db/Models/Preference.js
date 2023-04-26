export default (sequelize, DataTypes) => {
    const Preference = sequelize.define('Preference', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        key: { type: DataTypes.TEXT, allowNull: false },
        value: { type: DataTypes.TEXT, allowNull: false },
        name: { type: DataTypes.TEXT, allowNull: false },
        desc: { type: DataTypes.TEXT },
        type: {
            type: DataTypes.ENUM,
            values: ['boolean', 'text', 'list'],
            allowNull: false
        }
    });

    return Preference;
};
