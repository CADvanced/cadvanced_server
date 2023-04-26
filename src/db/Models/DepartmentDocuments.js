export default (sequelize, DataTypes) => {
    const DepartmentDocument = sequelize.define('DepartmentDocument', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: { type: DataTypes.TEXT, allowNull: false },
        filepath: { type: DataTypes.TEXT, allowNull: false }
    });
    DepartmentDocument.associate = function (models) {
        models.DepartmentDocument.belongsTo(models.Department, {
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };
    return DepartmentDocument;
};
